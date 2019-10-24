<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Entity\User;

class UserFixtures
    extends Fixture
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $rows = [['john', '1234'], ['alice', '1234'], ['bob', '1234']];

        foreach ($rows as $row)
        {
            $user = new User();

            $password = $row[1];
            $password = $this->encoder->encodePassword($user, $password);

            $user->setUsername($row[0])->setPassword($password)->setEmail($row[0].'@gmail.com');

            $manager->persist($user);
        }

        $manager->flush();
    }
}
