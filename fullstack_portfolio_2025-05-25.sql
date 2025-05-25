# ************************************************************
# Sequel Ace SQL dump
# Version 20094
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Hôte: localhost (MySQL 11.7.2-MariaDB)
# Base de données: fullstack_portfolio
# Temps de génération: 2025-05-25 15:08:28 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump de la table doctrine_migration_versions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `doctrine_migration_versions`;

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `doctrine_migration_versions` WRITE;
/*!40000 ALTER TABLE `doctrine_migration_versions` DISABLE KEYS */;

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`)
VALUES
	('DoctrineMigrations\\Version20250525140001','2025-05-25 14:00:07',184);

/*!40000 ALTER TABLE `doctrine_migration_versions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump de la table project
# ------------------------------------------------------------

DROP TABLE IF EXISTS `project`;

CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `description` longtext NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  `techno_used` longtext NOT NULL COMMENT '(DC2Type:array)',
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;

INSERT INTO `project` (`id`, `title`, `is_active`, `description`, `image`, `updated_at`, `techno_used`, `date`)
VALUES
	(7,'E commerce',1,'Projet de boutique en ligne moderne','Capture-d-ecran-2025-05-25-a-17-03-50-68333161b5c88.png',NULL,'a:4:{i:0;s:5:\"React\";i:1;s:4:\"Nuxt\";i:2;s:8:\"Tailwind\";i:3;s:7:\"Shopify\";}','2025-05-14'),
	(8,'Portfolio étudiant',1,'Portfolio avec gamification pour projet de fin d\'année','Capture-d-ecran-2025-05-25-a-17-05-03-683331aa88b7c.png',NULL,'a:3:{i:0;s:3:\"3JS\";i:1;s:5:\"WebGL\";i:2;s:5:\"HTML5\";}','2013-12-12'),
	(9,'Intégration de maquette',1,'Projet d\'intégration d\'un site ','Capture-d-ecran-2025-05-25-a-17-06-14-683331f0992ae.png',NULL,'a:3:{i:0;s:4:\"SASS\";i:1;s:4:\"CSS3\";i:2;s:6:\"Liquid\";}','2002-05-25');

/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;


# Dump de la table project_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `project_user`;

CREATE TABLE `project_user` (
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`project_id`,`user_id`),
  KEY `IDX_B4021E51166D1F9C` (`project_id`),
  KEY `IDX_B4021E51A76ED395` (`user_id`),
  CONSTRAINT `FK_B4021E51166D1F9C` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_B4021E51A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `project_user` WRITE;
/*!40000 ALTER TABLE `project_user` DISABLE KEYS */;

INSERT INTO `project_user` (`project_id`, `user_id`)
VALUES
	(7,7),
	(7,8),
	(8,9),
	(9,7),
	(9,11);

/*!40000 ALTER TABLE `project_user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump de la table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(180) NOT NULL,
  `last_name` varchar(180) NOT NULL,
  `email` varchar(180) NOT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`roles`)),
  `password` varchar(255) NOT NULL,
  `study_year` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `roles`, `password`, `study_year`)
VALUES
	(1,'Admin','one','admin@gmail.com',X'5B22524F4C455F41444D494E225D','$2y$13$mpbVOs7wYJu.qR1O3DcOc.7Cx.73N71yL0iA6x4hlJUaZJWQ1qcyi',1),
	(7,'Anthony','Lopes','anthony@gmail.com',X'5B5D','$2y$13$1bnfon/W2S3SMmFymW.GHOQXWcx6xeXo8N/oc41yjtub2BVS4bSZG',3),
	(8,'Allia','Jarjir','allia@gmail.com',X'5B5D','$2y$13$wZWh.F9X9zHSlnHGHFHX4.zP9Wh59wqg8cJv0Fy5eh4Kumb99sliu',4),
	(9,'Jeff','Knaffo','jeff@gmail.com',X'5B5D','$2y$13$FQMSOk5m.pkS2OOb7oppXuzyFxtIuVgU2itP.MeKb9Tj5vOqB1Wc6',4),
	(10,'Maxence','Vandeghen','maxence@gmail.com',X'5B5D','$2y$13$4GqZl9km05ESnlMjMwAH2e5eogDtDN6T8t.gdd7vg4DSMLkbCxOHi',1),
	(11,'Florient','Decots','flo975@gmail.com',X'5B5D','$2y$13$ahnO.x86eOBN9U8UmCos/eOp8hI.ocHgcTzff9.bl/8CxzBp4WQvC',5);

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
