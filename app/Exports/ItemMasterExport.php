<?php

namespace App\Exports;

use App\Models\Segmentations;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithStyles;

class ItemMasterExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;

    protected $query;
    protected $headers;
    protected $columns;
    protected $segmentationHeaders;
    

    public function __construct($query, $headers, $columns, $segmentationHeaders) {
        $this->query = $query;
        $this->headers = $headers;
        $this->columns = $columns;
        $this->segmentationHeaders = $segmentationHeaders;
    }

        public function headings(): array {
            
            $headers = $this->headers;
            $segmentation_inputs = $this->segmentationHeaders;

            if (!empty($segmentation_inputs)) {
                $segmentationHeader = [];

                foreach ($segmentation_inputs as $segmentation) {
                    $segmentationHeader[] = ucwords(strtolower($segmentation->segmentation_description)) ?? "";
                }

                $uomIndex = array_search('UOM Code',  $headers);

                if ($uomIndex !== false) {
                    array_splice($headers, $uomIndex + 1, 0, $segmentationHeader);
                } else {
                    $headers = array_merge($headers, $segmentationHeader);
                }
            }

            return $headers;
        }

    public function map($item): array {

        $data = [];

        foreach ($this->columns as $column) {
            $data[] = data_get($item, $column, null);
        }

        $segmentation_inputs = $this->segmentationHeaders;
        $segmentations = $item->getItemSegmentations;

        if (!empty($segmentations)) {
            $segmentationValues = [];

            foreach ($segmentation_inputs as $segmentation_input) {
                $segmentationValue = $segmentations->where('segmentations_id', $segmentation_input->id)->first();
                $segmentationValues[] = $segmentationValue->getSkuLegend->sku_legend_description ?? "";
            }

            $uomIndex = array_search('UOM Code', $this->headers);

            if ($uomIndex !== false) {
                $before = array_slice($data, 0, $uomIndex + 1);
                $after = array_slice($data, $uomIndex + 1);
                $data = array_merge($before, $segmentationValues, $after);
            } else {
                $data = array_merge($data, $segmentationValues);
            }
        }

        return $data;
    }

    public function query(){       
        return $this->query;
    }
    
    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('1:1')->getFont()->setBold(true);
        $sheet->getStyle($sheet->calculateWorksheetDimension())->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
    }
}
