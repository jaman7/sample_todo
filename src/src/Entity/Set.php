<?php

namespace App\Entity;

use Doctrine\Common\Collections\Collection;
use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\TimePoint;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SetRepository")
 * @ORM\Table(name="sets")
 */
class Set
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=1024, options={"default":""})
     */
    private $description = '';

    /**
     * @ORM\Column(type="integer", options={"default":0})
     */
    private $pool = 0;

    /**
     * @ORM\ManyToOne(targetEntity="User", inversedBy="sets")
     * @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity="Task", mappedBy="set")
     */
    private $tasks;

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPool(): int
    {
        return $this->pool;
    }

    public function setPool(int $pool): self
    {
        $this->pool = $pool;

        return $this;
    }

    public function incrementPool(): int
    {
        $this->pool += 1;

        return $this->pool;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function addTask(Task $task_new, ?int $position = null): self
    {
        if ($this->tasks->contains($task_new))
            $this->tasks->removeElement($task_new);

        if ($position != null)
        {
            $position_max = 0;

            foreach ($this->tasks as $task)
            {
                $position_curr = $task->getPosition();

                if ($position_curr >= $position)
                {
                    $task->incrementPosition();
                    $position_curr = $task->getPosition();
                }
                if ($position_max < $position_curr)
                    $position_max = $position_curr;
            }
            if ($position_max < $position)
            {
                $position_max += 1;
                $position = $position_max;
            }
            $this->setPool($position_max);

            $task_new->setPosition($position);
        }
        else
            $task_new->setPosition($this->incrementPool());

        $this->tasks->add($task_new);
        $task_new->setSet($this);

        return $this;
    }

    public function findTask(int $task_id): ?Task
    {
        foreach ($this->tasks as $task)
            if ($task->getId() == $task_id)
                return $task;

        return null;
    }

    public function getTasks(): Collection
    {
        return $this->tasks;
    }

    public function removeTask(Task $task): self
    {
        if ($this->tasks->contains($task))
        {
            $position_max = 0;

            $this->tasks->removeElement($task);

            $position = $task->getPosition();
            foreach ($this->tasks as $task)
            {
                $position_curr = $task->getPosition();

                if ($position_curr > $position)
                {
                    $task->decrementPosition();
                    $position_curr = $task->getPosition();
                }
                if ($position_max < $position_curr)
                    $position_max = $position_curr;
            }

            $this->setPool($position_max);
        }

        return $this;
    }
}
