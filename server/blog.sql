CREATE DATABASE  IF NOT EXISTS `blog` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `blog`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: blog
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `text` varchar(3000) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `post_id_fk_idx` (`post_id`),
  KEY `user_id_fk_idx` (`user_id`),
  CONSTRAINT `post_id_fk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`idposts`),
  CONSTRAINT `user_id_fk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (30,148,30,'I am a big fan of the halo franchise, I liked your post.','2023-04-10 18:07:37'),(31,150,17,'Nice post :)','2023-04-10 18:19:09');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_total_comments_insert` AFTER INSERT ON `comment` FOR EACH ROW BEGIN
  UPDATE posts
  SET total_comments = total_comments + 1
  WHERE idposts = NEW.post_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_total_comments_delete` AFTER DELETE ON `comment` FOR EACH ROW BEGIN
  UPDATE posts
  SET total_comments = total_comments - 1
  WHERE idposts = OLD.post_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_post_likes` (`user_id`,`post_id`),
  KEY `user_id_fk_idx` (`user_id`),
  KEY `post_id_fk_idx` (`post_id`),
  CONSTRAINT `post_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`idposts`),
  CONSTRAINT `user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=226 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (223,148,17,'2023-04-10 17:53:13'),(224,148,30,'2023-04-10 18:06:36'),(225,150,30,'2023-04-10 18:06:39');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_total_likes_insert` AFTER INSERT ON `likes` FOR EACH ROW BEGIN
    UPDATE posts p
    SET total_likes = (
        SELECT COUNT(*)
        FROM likes l
        WHERE l.post_id = p.idposts
    )
    WHERE p.idposts = NEW.post_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_total_likes_delete` AFTER DELETE ON `likes` FOR EACH ROW BEGIN
    UPDATE posts p
    SET total_likes = (
        SELECT COUNT(*)
        FROM likes l
        WHERE l.post_id = p.idposts
    )
    WHERE p.idposts = OLD.post_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `idposts` int NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `image` varchar(500) NOT NULL,
  `title` varchar(100) NOT NULL,
  `category` varchar(45) NOT NULL,
  `date_post` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `text` varchar(10000) NOT NULL,
  `synopsis` varchar(150) NOT NULL,
  `total_likes` int DEFAULT '0',
  `total_comments` int DEFAULT '0',
  PRIMARY KEY (`idposts`),
  KEY `id_users_idx` (`id`),
  CONSTRAINT `id_users` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (148,17,'1681149391054_capsule_616x353.jpg','The Halo Franchise','Games','2023-04-10 17:47:54','<p>The Halo franchise is a beloved part of video game culture, offering an immersive and thrilling gaming experience. The games are known for their epic battles against powerful alien races such as the Covenant and the Prometheans, with players wielding a variety of weapons and vehicles to defeat their enemies.</p><p><br></p><p>In addition to its impressive gameplay, the Halo franchise is renowned for its rich lore and world-building. The games explore themes such as the nature of humanity, the dangers of unchecked technology, and the consequences of war. The franchise has also expanded into other media, including novels and comics, which flesh out the backstory of the games and introduce new characters and settings.</p><p><br></p><p>The Halo franchise has also made significant contributions to the first-person shooter genre, introducing new gameplay mechanics and innovations that have influenced other games. The series\' robust multiplayer mode is a staple of the franchise, allowing players to engage in frenetic matches against each other online.</p><p><br></p><p>Overall, the Halo franchise is a must-play for fans of first-person shooters and science fiction. With its engaging gameplay, memorable characters, and rich lore, the series has secured its place in video game history.</p>','Epic sci-fi FPS series featuring supersoldier Master Chief battling powerful alien races.',2,1),(149,17,'1681149677508_Star-Wars.jpg','The Star Wars Franchise','Cinema','2023-04-10 18:01:17','<p>The Star Wars franchise is a cultural phenomenon that has captivated audiences for over four decades. Created by George Lucas, the series takes place in a galaxy far, far away and features epic battles between the light and dark sides of the Force.</p><p><br></p><p>The franchise has spawned numerous films, TV shows, books, comics, and video games, making it one of the most expansive and beloved universes in pop culture. The series is renowned for its memorable characters, including Luke Skywalker, Darth Vader, Han Solo, and Princess Leia, and its iconic musical score composed by John Williams.</p><p><br></p><p>The franchise explores themes such as the struggle between good and evil, redemption, family, and destiny. Whether you\'re a die-hard fan or a casual viewer, the Star Wars franchise has something for everyone.</p>','A space opera franchise that takes place in a galaxy far, far away, featuring Jedi, Sith, and memorable characters.',0,0),(150,30,'1681149989455_40022740.jpg','Lionel Messi','Sports','2023-04-10 18:06:29','<p>Lionel Messi is widely considered to be one of the greatest football players of all time. Born and raised in Rosario, Argentina, Messi began his football career at a young age, and quickly rose through the ranks to become a star player.</p><p><br></p><p>He is renowned for his incredible speed, agility, and precision on the field, as well as his record-breaking goal-scoring abilities. Messi has won numerous awards throughout his career, including seven Ballon d\'Or titles, which is the highest number ever achieved by a football player.</p><p><br></p><p>He has spent the majority of his career playing for Barcelona FC, where he has won numerous titles, including four Champions League trophies. Messi is also the all-time leading goalscorer for Barcelona and the Argentine national team. His incredible achievements on the field have earned him a legion of fans around the world, and he is widely regarded as an inspiration to young football players everywhere.</p>','Argentine football superstar and record-breaking goalscorer.',1,1);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password` char(60) NOT NULL,
  `date_user` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `biography` varchar(150) DEFAULT NULL,
  `photo` varchar(500) DEFAULT '1680599546975_photodefault.jpg',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (17,'Davi Parma','daviparma09@hotmail.com','$2b$12$liCWB3wJvfRxmXbf/GsEXurdsI3PyUgko8Tsl91eu5EcCZoQUmm2i','2023-03-15 16:43:57','I am a web developer, love video games and watching movies and series','1681148938056_Davi_Parma_Photo.png'),(30,'Matheus','matheusgarciap10@hotmail.com','$2b$12$A593IRsPiOWzEtJJCAKhX.O1r2IjSjOFPEZIdTfO3pdEGnH4eTbb.','2023-04-10 18:03:06','I am a big fan of the soccer player, named lionel messi','1681150653073_leo-messi.jpg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'blog'
--

--
-- Dumping routines for database 'blog'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-11  0:02:05
