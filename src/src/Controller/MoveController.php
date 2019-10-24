<?php

namespace App\Controller;

use App\Entity\Set;
use App\Entity\Task;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MoveController
    extends AbstractController
{
    /**
     * @Route("/api/move/{task_id}/{task_pos}/{set_id_new}", name="api_move",
     *        requirements={"task_id": "\d+", "task_pos": "\d+", "set_id_new": "\d+"})
     */
    public function move(int $task_id, int $task_pos, ?int $set_id_new = null)
    {
        if (!$this->isGranted("ROLE_USER"))
            throw new AuthenticationException();

        if ($task_pos < 1)
            return new JsonResponse([], Response::HTTP_NOT_ACCEPTABLE);

        $em = $this->getDoctrine()->getManager();

        $task = $em->getRepository(Task::class)->find($task_id);
        if (!$task)
            return new JsonResponse([], Response::HTTP_NOT_FOUND);

        $set_curr = $task->getSet();
        if (!$set_curr)
            return new JsonResponse([], Response::HTTP_NOT_FOUND);

        if ($set_id_new != null && $set_id_new != $set_curr->getId())
        {
            $set_new = $em->getRepository(Set::class)->find($set_id_new);
            if (!$set_new)
                return new JsonResponse([], Response::HTTP_NOT_FOUND);
        }
        else
            $set_new = $set_curr;

        if ($task->getPosition() == $task_pos && $set_curr == $set_new)
            return new JsonResponse([]);

        $set_curr->removeTask($task);
        $set_new->addTask($task, $task_pos);

        $em->persist($set_curr);
        if ($set_curr != $set_new)
            $em->persist($set_new);
        $em->persist($task);
        $em->flush();

        return new JsonResponse([]);
    }
}
