<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class UniqueFirstDigit implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Get the first digit of the input value
        $firstDigit = substr($value, 0, 1);

        // Fetch all existing counter codes from the database
        $existingCodes = DB::table('counters')->pluck('counter_code');

        // Check if any existing code starts with the same first digit
        foreach ($existingCodes as $code) {
            if (substr($code, 0, 1) == $firstDigit) {
                $fail('Counter Code already exist.');
                return;
            }
        }
    }
}
