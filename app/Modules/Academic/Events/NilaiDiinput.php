<?php

namespace App\Modules\Academic\Events;

use App\Models\Nilai;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Nilai Diinput Event
 * 
 * Triggered when a new grade is entered
 */
class NilaiDiinput
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Nilai $nilai
    ) {}
}
