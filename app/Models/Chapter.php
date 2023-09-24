<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Chapter
 * 
 * @property int $id
 * @property string $subject_id
 * @property int $chapter_number
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Subject $subject
 * @property Collection|Question[] $questions
 *
 * @package App\Models
 */
class Chapter extends Model
{
	protected $table = 'chapters';

	protected $casts = [
		'chapter_number' => 'int'
	];

	protected $fillable = [
		'subject_id',
		'chapter_number',
		'name'
	];

	public function subject()
	{
		return $this->belongsTo(Subject::class);
	}

	public function questions()
	{
		return $this->hasMany(Question::class);
	}
}
