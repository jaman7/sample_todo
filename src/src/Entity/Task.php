<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\TimePoint;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TaskRepository")
 * @ORM\Table(name="tasks", indexes={@ORM\Index(name="tasks_set_id_position_idx", columns={"set_id", "position"})})
})
 */
class Task
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
     * @ORM\Column(type="string", length=1024)
     */
    private $description = '';

    /**
     * @ORM\Column(type="integer", options={"default":0})
     */
    private $position;

    /**
     * @ORM\ManyToOne(targetEntity="Set", inversedBy="tasks")
     * @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     */
    private $set;

    /**
     * @ORM\Column(type="boolean", options={"default":false})
     */
    private $state = false;

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

    public function getPosition(): int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

        return $this;
    }

    public function incrementPosition(): self
    {
        $this->position += 1;

        return $this;
    }

    public function decrementPosition(): self
    {
        $this->position -= 1;

        return $this;
    }

    public function setSet(Set $set): self
    {
        $this->set = $set;

        return $this;
    }

    public function getSet(): Set
    {
        return $this->set;
    }

    public function getState(): bool
    {
        return $this->state;
    }

    public function setState(bool $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getProperties(): array
    {
        return ['id'          => $this->getId(),
                'name'        => $this->getName(),
                'description' => $this->getDescription(),
                'state'       => $this->getState(),
                'position'    => $this->getPosition()];
    }
}
