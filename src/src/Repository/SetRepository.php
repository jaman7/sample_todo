<?php

namespace App\Repository;

use App\Entity\Set;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Set|null find($id, $lockMode = null, $lockVersion = null)
 * @method Set|null findOneBy(array $criteria, array $orderBy = null)
 * @method Set[]    findAll()
 * @method Set[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SetRepository
    extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Set::class);
    }

    /**
     * @return Set[] Returns an array of Set objects
     */
    public function findAllOfUser(int $user_id)
    {
        // TODO to delete
        return $this->createQueryBuilder('s')->where("s.user_id = $user_id")->getQuery()->getResult();
    }

    // /**
    //  * @return Set[] Returns an array of Set objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Set
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
