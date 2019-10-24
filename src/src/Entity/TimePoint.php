<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

// TODO do usunięcia

/**
 * @ORM\Embeddable
 */
class TimePoint
{
    /**
     * @ORM\Column(type="datetimetz")
     */
    private $creat;

    /**
     * @ORM\Column(type="datetimetz")
     */
    private $updat;
}
