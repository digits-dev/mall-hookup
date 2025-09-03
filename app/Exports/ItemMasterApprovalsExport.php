<?php

namespace App\Exports;

use App\Models\ItemMasterApproval;
use App\Models\ModuleHeaders;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ItemMasterApprovalsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{

    protected $moduleHeaders;

    public function __construct()
    {
        $this->moduleHeaders = ModuleHeaders::getModuleHeaders();
    }

    public function collection()
    {
        return ItemMasterApproval::with(['getCreatedBy'])->where('status', 'FOR APPROVAL')->get();
    }
    
    public function headings(): array
    {
        return [
          'UPC Code',
          'Supplier Item Code',
          'Item Description',
          'Brand Description',
          'Category Description',
          'Created By',
          'Created Date'
        ];
    }

    public function map($item): array
    {

        $itemValues = json_decode($item->item_values, true) ?? [];

        foreach ($itemValues as $key => $value) {
            if (isset($this->moduleHeaders[$key])) {
                $tableName = $this->moduleHeaders[$key]->table;
                $labelColumn = $this->moduleHeaders[$key]->table_select_label;

                $description = DB::table($tableName)->where('id', $value)->value($labelColumn);
                $itemValues[$key] = $description ?? $value;
            }
        }

        return [
            $itemValues['upc_code'] ?? '',
            $itemValues['supplier_item_code'] ?? '',
            $itemValues['item_description'] ?? '',
            $itemValues['brands_id'] ?? '',
            $itemValues['categories_id'] ?? '',
            $item->getCreatedBy->name ?? '', 
            $item->created_at ?? '', 
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('1:1')->getFont()->setBold(true);
        $sheet->getStyle($sheet->calculateWorksheetDimension())->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
    }
}