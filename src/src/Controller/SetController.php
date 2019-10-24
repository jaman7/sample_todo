<?php

namespace App\Controller;

use App\Entity\Set;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraints as Assert;

class SetController extends AbstractController
{
    /**
     * @Route("/api/sets/create", name="api_sets_create", methods={"POST"})
     */
    public function create(Request $request, ValidatorInterface $validator)
    {
        if (!$this->isGranted("ROLE_USER")) {
            throw new AuthenticationException();
        }

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
            ])
        ]);

        $validator->validate($data, $constraint);

        $set = new Set();

        $set->setName($data['name']);
        if (isset($data['description'])) {
            $set->setDescription($data['description']);
        }

        $user->addSet($set);

        $em->persist($set);
        $em->persist($user);
        $em->flush();

        // return new JsonResponse([]);
        return new JsonResponse(['id' => $set->getId(), 'name' => $set->getName(), 'description' => $set->getDescription()]);
    }

    /**
     * @Route("/api/sets", name="api_sets", methods={"GET"})
     */
    public function list()
    {
        if (!$this->isGranted("ROLE_USER")) {
            throw new AuthenticationException();
        }

        $user = $this->getUser();
        $sets = $user->getSets();
        $json = [];

        foreach ($sets as $set) {
            $json[] = ['id'          => $set->getId(),
                       'name'        => $set->getName(),
                       'description' => $set->getDescription()];
        }

        return new JsonResponse($json);
    }

    /**
     * @Route("/api/sets/all", name="api_sets_all", methods={"GET"}, condition="'dev' === '%kernel.environment%'")
     */
    public function listAll()
    {
        if (!$this->isGranted("ROLE_USER")) {
            throw new AuthenticationException();
        }

        $user = $this->getUser();
        $sets = $user->getSets();
        $json = [];

        $get_tasks_from_set = function (Set $set): array {
            $tasks = [];
            $tasks_pos = [];

            foreach ($set->getTasks() as $task) {
                $tasks_pos[$task->getPosition()] = $task;
            }

            ksort($tasks_pos);
            foreach ($tasks_pos as $position => $task) {
                $tasks[] = $task->getProperties();
            }

            return $tasks;
        };

        foreach ($sets as $set) {
            $json[] = ['id'          => $set->getId(),
                       'name'        => $set->getName(),
                       'description' => $set->getDescription(),
                       'pool'        => $set->getPool(),
                       'tasks'       => $get_tasks_from_set($set)];
        }

        return new JsonResponse($json);
    }

    /**
     * @Route("/api/sets/{set_id}/update", name="api_sets_update", methods={"PUT"})
     */
    public function update(Request $request, ValidatorInterface $validator, int $set_id)
    {
        if (!$this->isGranted("ROLE_USER")) {
            throw new AuthenticationException();
        }

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
            ])
        ]);

        $validator->validate($data, $constraint);

        $set = $user->findSet($set_id);
        if ($set) {
            $modified = false;

            if (isset($data['name']) && $data['name'] != $set->getName()) {
                $set->setName($data['name']);
                $modified = true;
            }
            if (isset($data['description']) && $data['description'] != $set->getDescription()) {
                $set->setDescription($data['description']);
                $modified = true;
            }

            if ($modified) {
                $em->persist($set);
                $em->flush();
            }
        }

        return new JsonResponse([]);
    }

    /**
     * @Route("/api/sets/{set_id}/delete", name="api_sets_delete", methods={"DELETE"})
     */
    public function remove(int $set_id)
    {
        if (!$this->isGranted("ROLE_USER")) {
            throw new AuthenticationException();
        }

        $user = $this->getUser();
        $em = $this->getDoctrine()->getManager();

        $set = $user->findSet($set_id);
        if ($set) {
            $em->remove($set);
            $em->flush();

            return new JsonResponse([]);
        } else {
            return new JsonResponse([], Response::HTTP_NOT_FOUND);
        }
    }
}
