<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;

class ImportTemplate implements FromArray
{
    protected array $headers;

    public function __construct(array $headers)
    {
        $this->headers = $headers;
    }

    public function array(): array
    {
        return [
            $this->headers, 
        ];
    }
}