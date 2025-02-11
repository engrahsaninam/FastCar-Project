-- MySQL dump 10.13  Distrib 8.3.0, for macos14.2 (x86_64)
--
-- Host: localhost    Database: eucars
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cars` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double NOT NULL,
  `mileage` double NOT NULL,
  `age` double NOT NULL,
  `power` int NOT NULL,
  `gear` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fuel` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zipcode` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `images` json DEFAULT NULL,
  `url` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attrs` json DEFAULT NULL,
  `source` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_id` (`id`,`source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `source` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `car_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `context` longblob,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url_UNIQUE` (`url`),
  KEY `car_id` (`car_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `model_tasks`
--

DROP TABLE IF EXISTS `model_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `source` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maker` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `context` json DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_index` (`maker`,`source`)
) ENGINE=InnoDB AUTO_INCREMENT=255 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `models`
--

DROP TABLE IF EXISTS `models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `models` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `maker` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `maker_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_line` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_line_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attrs` text COLLATE utf8mb4_unicode_ci,
  `updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`maker`,`model_line`,`model`,`source`)
) ENGINE=InnoDB AUTO_INCREMENT=4628 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `source` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `context` json NOT NULL,
  `unique_value` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_value_UNIQUE` (`unique_value`)
) ENGINE=InnoDB AUTO_INCREMENT=1439 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'eucars'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-14 20:57:39
