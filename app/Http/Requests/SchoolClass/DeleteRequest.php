<?php

namespace App\Http\Requests\SchoolClass;

use App\Traits\CustomValidateResponse;
use Illuminate\Foundation\Http\FormRequest;

class DeleteRequest extends FormRequest
{
    use CustomValidateResponse;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ids'  => ['required', 'array'],
            'ids.*' => ['integer']
        ];
    }
}
