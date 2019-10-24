<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190809120525 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE sets DROP CONSTRAINT FK_948D45D1A76ED395');
        $this->addSql('ALTER TABLE sets ADD CONSTRAINT FK_948D45D1A76ED395 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tasks DROP CONSTRAINT FK_5058659710FB0D18');
        $this->addSql('ALTER TABLE tasks ADD CONSTRAINT FK_5058659710FB0D18 FOREIGN KEY (set_id) REFERENCES sets (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE tasks DROP CONSTRAINT fk_5058659710fb0d18');
        $this->addSql('ALTER TABLE tasks ADD CONSTRAINT fk_5058659710fb0d18 FOREIGN KEY (set_id) REFERENCES sets (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE sets DROP CONSTRAINT fk_948d45d1a76ed395');
        $this->addSql('ALTER TABLE sets ADD CONSTRAINT fk_948d45d1a76ed395 FOREIGN KEY (user_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
