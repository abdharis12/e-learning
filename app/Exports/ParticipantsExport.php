<?php

namespace App\Exports;

use App\Enums\UserRole;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ParticipantsExport implements FromCollection, WithHeadings, WithStyles
{
    public function collection()
    {
        return User::where('role', UserRole::Peserta->value)
            ->select('name', 'email', 'created_at')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Nama Peserta',
            'Email',
            'Tanggal Daftar'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                ],
            ],
        ];
    }
}
