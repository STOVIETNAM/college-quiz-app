<?php

namespace App\Console\Commands;

use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CleanupImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cleanup-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up images that deleted in database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $question_images = [];

        Question::select('content')->chunk(100, function ($questions) use (&$question_images) {
            foreach ($questions as $question) {
                $question_images = array_merge($question_images, $this->extractImagePathsFromContent($question->content));
            }
        });

        QuestionOption::select('content')->chunk(100, function ($options) use (&$question_images) {
            foreach ($options as $option) {
                $question_images = array_merge($question_images, $this->extractImagePathsFromContent($option->content));
            }
        });

        $files = Storage::allFiles();
        $ignore_files = ['.gitignore'];

        $files = array_filter($files, function ($file) use ($question_images, $ignore_files) {
            if (in_array($file, $ignore_files)) return false;
            return !in_array($file, $question_images);
        });

        Storage::delete($files);
    }

    protected function extractImagePathsFromContent(string $content): array
    {
        $image_paths = [];
        libxml_use_internal_errors(true);
        $html_string = mb_convert_encoding($content, 'UTF-8', 'auto');
        $dom = new \DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($html_string, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        $images = $dom->getElementsByTagName('img');

        foreach ($images as $img) {
            $src = $img->attributes['src']->textContent;
            if (Str::startsWith($src, '/uploads')) {
                $image_paths[] = Str::replace('/uploads/', '', $src);
            }
        }

        return $image_paths;
    }
}