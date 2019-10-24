<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class HomeController
    extends AbstractController
{
    /**
     * @Route("/", name="app_home")
     */
    public function index()
    {
        if ($this->isGranted('ROLE_USER'))
            return $this->redirectToRoute('app_dashboard');

        return $this->render('home/index.html.twig', ['controller_name' => 'HomeController',]);
    }
}
