<?php

namespace App\Controller;

use App\Entity\Task;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class TaskController
    extends AbstractController
{
    /**
     * @Route("/api/sets/{set_id}/tasks/create", name="api_tasks_create", methods={"POST"})
     */
    public function create(Request $request, ValidatorInterface $validator, int $set_id)
    {
        if (!$this->isGranted("ROLE_USER"))
            throw new AuthenticationException();

        $user = $this->getUser();
        $em = $this->getDoctrine()->getManager();

        $data = json_decode($request->getContent(), true);

        $constraint = new Assert\Collection([
            'name'        => new Assert\Required([
                new Assert\Type('string'),
                new Assert\NotBlank(),
                new Assert\Length(['min' => 1, 'max' => 64])
            ]),
            'description' => new Assert\Optional([
                new Assert\Type('string'),
                new Assert\Length(['min' => 0, 'max' => 1024])
            ]),
            'state'       => new Assert\Optional([
                new Assert\Type('boolean')
            ])
        ]);

        $validator->validate($data, $constraint);

        $set = $user->findSet($set_id);
        if ($set)
        {
            $task = new Task();

            $task->setName($data['name']);
            if (isset($data['description']))
                $task->setDescription($data['description']);
            if (isset($data['state']))
                $task->setState($data['state']);

            $set->addTask($task);

            $em->persist($task);
            $em->persist($set);
            $em->flush();

            return new JsonResponse(['id' => $task->getId(), 'position' => $task->getPosition()]);
        }
        else
            return new JsonResponse([], Response::HTTP_NOT_FOUND);
    }

    /**
     * @Route("/api/sets/{set_id}/tasks", name="api_tasks", methods={"GET"})
     */
    public function list(int $set_id)
    {
        if (!$this->isGranted("ROLE_USER"))
            throw new AuthenticationException();

        $user = $this->getUser();
        $set = $user->findSet($set_id);

        if ($set)
        {
            $json = [];
            $tasks_pos = [];

            foreach ($set->getTasks() as $task)
                $tasks_pos[$task->getPosition()] = $task;

            ksort($tasks_pos);
            foreach ($tasks_pos as $position => $task)
                $json[] = $task->getProperties();

            return new JsonResponse($json);
        }
        else
            return new JsonResponse([], Response::HTTP_NOT_FOUND);
    }

    /**
     * @Route("/api/sets/{set_id}/tasks/{task_id}/update", name="api_tasks_update", methods={"PUT"})
     */
    public function update(Request $request, ValidatorInterface $validator, int $set_id, int $task_id)
    {
        if (!$this->isGranted("ROLE_USER"))
            throw new AuthenticationException();

        $user = $this->getUser();
        $em = $this->getDoctrine()->getManager();

        $data = json_decode($request->getContent(), true);

        $constraint = new Assert\Collection([
            'name'        => new Assert\Optional([
                new Assert\Type('string'),
                new Assert\NotBlank(),
                new Assert\Length(['min' => 1, 'max' => 64])
            ]),
            'description' => new Assert\Optional([
                new Assert\Type('string'),
                new Assert\Length(['min' => 0, 'max' => 1024])
            ]),
            'state'       => new Assert\Optional([
                new Assert\Type('boolean')
            ])
        ]);

        $validator->validate($data, $constraint);

        $set = $user->findSet($set_id);
        if ($set)
        {
            $task = $set->findTask($task_id);
            if ($task)
            {
                $modified = false;

                if (isset($data['name']) && $data['name'] != $task->getName())
                {
                    $task->setName($data['name']);
                    $modified = true;
                }
                if (isset($data['description']) && $data['description'] != $task->getDescription())
                {
                    $task->setDescription($data['description']);
                    $modified = true;
                }
                if (isset($data['state']) && $data['state'] != $task->getState())
                {
                    $task->setState($data['state']);
                    $modified = true;
                }

                if ($modified)
                {
                    $em->persist($task);
                    $em->flush();
                }

                return new JsonResponse([]);
                //return new JsonResponse(['state' => $task->getState()]);
            }
        }

        return new JsonResponse([], Response::HTTP_NOT_FOUND);
    }

    /**
     * @Route("/api/sets/{set_id}/tasks/{task_id}/delete", name="api_tasks_delete", methods={"DELETE"})
     */
    public function remove(int $set_id, int $task_id)
    {
        if (!$this->isGranted("ROLE_USER"))
            throw new AuthenticationException();

        $user = $this->getUser();
        $em = $this->getDoctrine()->getManager();

        $set = $user->findSet($set_id);
        if ($set)
        {
            $task = $set->findTask($task_id);
            if ($task)
            {
                $set->removeTask($task);

                $em->remove($task);
                $em->persist($set);
                $em->flush();

                return new JsonResponse([]);
            }
        }

        return new JsonResponse([], Response::HTTP_NOT_FOUND);
    }
}
