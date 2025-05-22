<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250521145642 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // Supprimer la colonne is_active de la table user (elle doit exister)
        $this->addSql('ALTER TABLE user DROP is_active');

        // Ajouter la colonne is_active à project uniquement si elle n’existe pas déjà
        // Doctrine ne permet pas de faire du conditionnel dans addSql, donc :
        // Soit tu t’assures qu’elle n'existe pas en base (manuellement)
        // Soit tu supprimes cette ligne si déjà présente en BDD
        $this->addSql('ALTER TABLE project ADD is_active TINYINT(1) NOT NULL');
    }
    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE project DROP is_active
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user ADD is_active TINYINT(1) NOT NULL
        SQL);
    }
}
