<?php

namespace App\Console;

use App\Page;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Redis;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        // Commands\Inspire::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')
        //          ->hourly();

        $schedule->call(function() {

            $pages = Page::all();

            foreach ($pages as $page) {

                $key = 'page:' . $page->id . ':views';

                if (!Redis::exists($key)) {
                    Redis::set($key, 0);
                }

                $pageCount = Redis::get($key);

                $page->views = $pageCount;
                $page->save();
            }

        })->everyMinute(); // only every minute for dev. for prod need to change to every 15 / 30
    }
}
