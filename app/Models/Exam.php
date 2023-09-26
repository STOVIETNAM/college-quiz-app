<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Exam
 * 
 * @property int $id
 * @property int $course_id
 * @property string $name
 * @property Carbon $exam_date
 * @property int $exam_time
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Course $course
 * @property Collection|Question[] $questions
 * @property Collection|ExamTracker[] $exam_trackers
 *
 * @package App\Models
 */
class Exam extends Model
{
	protected $table = 'exams';

	protected $casts = [
		'course_id' => 'int',
		'exam_date' => 'datetime',
		'exam_time' => 'int'
	];

	protected $fillable = [
		'course_id',
		'name',
		'exam_date',
		'exam_time'
	];

	public function course()
	{
		return $this->belongsTo(Course::class);
	}

	public function questions()
	{
		return $this->belongsToMany(Question::class, 'exam_questions')
					->withPivot('id')
					->withTimestamps();
	}

	public function exam_trackers()
	{
		return $this->hasMany(ExamTracker::class);
	}
}
