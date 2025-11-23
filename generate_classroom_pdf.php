<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib/fpdf.php';

$classroom = isset($_POST['classroom']) ? trim((string)$_POST['classroom']) : '';
if ($classroom === '') {
    http_response_code(400);
    echo 'Classroom is required.';
    exit;
}

$invigilator = trim((string)($_POST['invigilator'] ?? ''));
$notes = trim((string)($_POST['notes'] ?? ''));

$invigilatorLabel = $invigilator !== '' ? $invigilator : 'Not assigned';

$conn = get_db_connection();

$stmt = $conn->prepare(
    'SELECT t.subject,
            t.examdate,
            t.starttime,
            t.endtime,
            t.enrollnumber,
            t.department,
            t.year,
            s.stdname
     FROM trisub t
     LEFT JOIN studenttable s ON s.rollno = t.enrollnumber
     WHERE t.classroom = ?
     ORDER BY t.examdate, t.starttime, t.subject, t.enrollnumber'
);
$stmt->bind_param('s', $classroom);
$stmt->execute();
$result = $stmt->get_result();

if (!$result || $result->num_rows === 0) {
    http_response_code(404);
    echo 'No data found for classroom ' . htmlspecialchars($classroom);
    exit;
}

$sections = [];
while ($row = $result->fetch_assoc()) {
    $key = implode('|', [$row['subject'], $row['examdate'], $row['starttime'], $row['endtime'], $row['department'], $row['year']]);
    if (!isset($sections[$key])) {
        $sections[$key] = [
            'subject' => $row['subject'],
            'examdate' => $row['examdate'],
            'starttime' => $row['starttime'],
            'endtime' => $row['endtime'],
            'department' => $row['department'],
            'year' => $row['year'],
            'students' => [],
        ];
    }
    $sections[$key]['students'][] = [
        'roll' => $row['enrollnumber'],
        'name' => $row['stdname'] ?? 'Not available',
    ];
}

$pdf = new FPDF('P', 'mm', 'A4');
$pdf->SetTitle("Seating Plan - {$classroom}");
$pdf->SetAuthor('Exam Seating Arrangement System');
$pdf->SetMargins(15, 15, 15);

$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 16);
$pdf->Cell(0, 10, "Classroom: {$classroom}", 0, 1, 'C');
$pdf->SetFont('Arial', '', 12);
$pdf->Cell(0, 7, 'Generated on ' . date('d M Y H:i'), 0, 1, 'C');
$pdf->Cell(0, 7, "Invigilator: {$invigilatorLabel}", 0, 1, 'C');
if ($notes !== '') {
    $pdf->MultiCell(0, 7, "Notes: {$notes}", 0, 'C');
}
$pdf->Ln(5);

$renderSectionHeader = function(array $section, string $suffix = '') use ($pdf, $invigilatorLabel) {
    $pdf->SetFont('Arial', 'B', 13);
    $title = 'Subject: ' . $section['subject'];
    if ($suffix !== '') {
        $title .= " ({$suffix})";
    }
    $pdf->Cell(0, 8, $title, 0, 1);
    $pdf->SetFont('Arial', '', 11);
    $dateLabel = $section['examdate'] ? date('d M Y', strtotime($section['examdate'])) : 'Not scheduled';
    $timeLabel = trim(($section['starttime'] ?? '') . ' - ' . ($section['endtime'] ?? ''));
    $pdf->Cell(
        0,
        6,
        sprintf(
            'Date: %s   Time: %s   Batch: %s Year %s   Invigilator: %s',
            $dateLabel,
            $timeLabel !== ' - ' ? $timeLabel : 'Not set',
            $section['department'],
            $section['year'],
            $invigilatorLabel
        ),
        0,
        1
    );
};

$renderTableHeader = function() use ($pdf) {
    $pdf->SetFillColor(13, 71, 161);
    $pdf->SetTextColor(255);
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->Cell(20, 8, 'Seat', 1, 0, 'C', true);
    $pdf->Cell(35, 8, 'Roll No.', 1, 0, 'C', true);
    $pdf->Cell(85, 8, 'Student Name', 1, 0, 'L', true);
    $pdf->Cell(40, 8, 'Remarks', 1, 1, 'L', true);
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetTextColor(0);
};

$encodeText = static function (string $text): string {
    if ($text === '') {
        return '';
    }
    if (function_exists('iconv')) {
        $converted = @iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text);
        if ($converted !== false) {
            return $converted;
        }
    }
    return $text;
};

foreach ($sections as $section) {
    $renderSectionHeader($section);
    $renderTableHeader();

    $seatNumber = 1;
    foreach ($section['students'] as $student) {
        $pdf->Cell(20, 7, (string)$seatNumber, 1);
        $pdf->Cell(35, 7, (string)$student['roll'], 1);
        $pdf->Cell(85, 7, $encodeText($student['name']), 1);
        $pdf->Cell(40, 7, '', 1);
        $pdf->Ln();
        $seatNumber++;
        if ($pdf->GetY() > 260) {
            $pdf->AddPage();
            $renderSectionHeader($section, 'cont.');
            $renderTableHeader();
        }
    }

    $pdf->Ln(4);
}

$stmt->close();
$conn->close();

$pdf->Output('D', "SeatingPlan-{$classroom}.pdf");
exit;

