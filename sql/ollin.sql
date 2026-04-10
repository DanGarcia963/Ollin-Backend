-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-04-2025 a las 16:14:07
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ollin`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `id_Administrador` int(11) NOT NULL,
  `Correo` varchar(50) NOT NULL,
  `Contrasena` varchar(60) NOT NULL,
  `id_Museo` varchar(27) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anuncio`
--

CREATE TABLE `anuncio` (
  `id_Anuncio` int(11) NOT NULL,
  `informacion` varchar(100) NOT NULL,
  `archivo_binario` longblob NOT NULL,
  `archivo_nombre` varchar(255) NOT NULL DEFAULT '',
  `archivo_peso` varchar(15) NOT NULL DEFAULT '',
  `archivo_tipo` varchar(25) NOT NULL DEFAULT '',
  `id_Administrador` int(11) NOT NULL,
  `id_Museo` varchar(27) NOT NULL,
  `Fecha_Publicacion` date NOT NULL DEFAULT curdate(),
  `Fecha_Limite` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `museo`
--

CREATE TABLE `museo` (
  `id_Museo` varchar(27) NOT NULL,
  `Nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `museo`
--

INSERT INTO `museo` (`id_Museo`, `Nombre`) VALUES
('ChIJ-0pdMR750YURI_LhjrE88wQ', 'Museo del Tecpan'),
('ChIJ-5Vgip750YURMqG_JvZgEy4', 'Museo de Figuras de Cera de la Villa'),
('ChIJ-dDMLXL_0YURFiY0wnexgNw', 'Museo Polyfroum Siqueiros(Cerrado)'),
('ChIJ-wBzWNH40YURTUqnO6pJWOM', 'Museo Nacional de San Carlos'),
('ChIJ0-455OX_0YURrb32hWWciC4', 'Casa Fuerte del Indio Fernandez'),
('ChIJ007Hriv_0YURF1CdB6bR4wM', 'Museo Centro de la Imagen'),
('ChIJ06wbFnL_0YURsGFqYUgJllM', 'Casa Museo Guillermo Tovar de Teresa'),
('ChIJ0fhThCQA0oURALaHxBtFZ14', 'Museo Nacional de Arte(MUNAL)'),
('ChIJ0y36DTr_0YURgx_L8uCEw_E', 'Salon de la Plastica Mexicana '),
('ChIJ0YaRcJUC0oURKvnNWeFgedQ', 'Museo Tezozomoc '),
('ChIJ0ZehHEv_0YURxRnbdFfq4Nc', 'Museo Salon de Cabildos del Antiguo Palacio del Ayuntamiento'),
('ChIJ1_utKhsA0oURhrVIAvCWWBM', 'Museo Casa Estudio Diego Rivera y Frida Kahlo'),
('ChIJ2SROzi8FzoURlWUXY1eXEQc', 'Museo Regional Altepepialcalli'),
('ChIJ3dGBci350YURsDYUZcq-kIw', 'Museo del Templo Mayor'),
('ChIJ3UEddt4B0oUR99SkjEQvQnc', 'Museo de Geofisica'),
('ChIJ3YQA-6X50YUR8DUYbslwXj8', 'Planetario Luis Enrique Erro'),
('ChIJ445B0AAAzoURDJ5enadXEDM', 'Museo Universitario de Ciencias y Artes (MUCA)'),
('ChIJ54kX9rf40YURkbpajXrUq38', 'Mana Musero de la Biblia'),
('ChIJ5xY48Z350YURhLTdU3_KgJs', 'Museo de los Ferrocarrileros'),
('ChIJ6-mYhcH_0YURLjWlwMkTqAc', 'Museo Jose Luis Cuevas'),
('ChIJ6SVzyvQAzoUR5ZgcjlTdWtA', 'Museo del Tiempo Tlalpan (Cerrado)'),
('ChIJ6XzRWQIA0oURzNHWnQB_Ers', 'Centro Cultural Isidro Fabela-Museo Casa del Risco'),
('ChIJ7WCy8TL50YURs8r52Z_Lm3k', 'Museo de la Caricatura'),
('ChIJ7YaCsy750YURNFYYJ2_ZwtA', 'Museo del Tequila y el Mezcal (MUTEM)'),
('ChIJ80aeXRsAzoURV-aOyjZ18AQ', 'Museo de Anatomopatologia Veterinaria Manuel H. Sarvide'),
('ChIJ888XJAAH0oURs6bA4M2m71E', 'Museo Centro Cultural Nacional Pedro Infante'),
('ChIJ8Tu7s-350YURKtDJCrZGYjM', 'Museo Manuel Tolsa'),
('ChIJ8zug4HIAzoURl_h__aNLwIU', 'Universum Museo de las Ciencias'),
('ChIJ8ZWV2cz-0YUR_dZtPvUaOPc', 'Palacio Nacional'),
('ChIJ9aTQgzr_0YURaua-0bHZiBQ', 'Museo del Objeto del Objeto (MODO)'),
('ChIJ9dC2SSr50YURbY8j7GyISTc', 'Museo Franz Mayer'),
('ChIJ9waAKjP50YURzOgkwgs15fc', 'Museo UNAM hoy'),
('ChIJa-eZPWUB0oUR0LvxyrQxwHo', 'Museo Casa Presidencial Lazaro Cardenas'),
('ChIJa005N9b40YURiiAG-q9_4OQ', 'Casa Rivas Mercado'),
('ChIJA0KYsiz50YURNCVEmA8LKxs', 'Palacio de Cultura Banamex(Palacio de Iturbide)'),
('ChIJa4YdgjP50YURda1s8q-h8kQ', 'Museo de las Constituciones'),
('ChIJA8BmgsEbzoUR1EVhfXJOyCU', 'Museo Tomas Medina Villarruel'),
('ChIJAQAAMLMB0oURD_4FLwX5JUs', 'Museo de Historia Natural y Cultura Ambiental'),
('ChIJAW6mReEB0oURfai5Fj_zJO8', 'Papalote Museo del Niño Chapultepec'),
('ChIJA_PI2FT-0YURF36v-bkj-00', 'Fundacion Maria y Hector Garcia '),
('ChIJB-AzoNH-0YURZryH2uWPzQ8', 'Museo de la Charreria'),
('ChIJb1NCWiv50YUR7bkDySJHeu0', 'Museo del Bicentenario'),
('ChIJB3JfKYf_0YURIkTKx0MAHqw', 'Museo de lo Increible Ripley'),
('ChIJBbT66kn50YURAhBfmMbpP7Q', 'Museo Banco de Mexico'),
('ChIJbbUgwcj50YURUxjLey1T2r8', 'Galeria de Arte de la SHCP'),
('ChIJCT06bhoC0oURszwDTCLicpM', 'Museo Soumaya, Plaza Carso'),
('ChIJcyHgF0b-0YURNvIjEXzHFHQ', 'Museo del Servicio de Transportes Electricos'),
('ChIJd0_AmtX40YURWtzx7Y7wS0Q', 'Laboratorio Arte Alameda'),
('ChIJD4MbPtgAzoUR8pxiHhA_eUU', 'Museo del Heroico Colegio Militar'),
('ChIJd7RNw9P-0YUREtncNln8HwQ', 'Museo de Sitio del Antiguo Hospital Concepcion Beistegui'),
('ChIJDyVqpOEB0oURU3r1WNxPXlo', 'La Casa Luis Barragan'),
('ChIJE-z088wBzoURBQC1jpv8UXc', 'Museo Anahuacalli'),
('ChIJewYUqQEA0oURZz2YNZAvENw', 'Museo Soumaya, Plaza Loreto'),
('ChIJfbxVhjL_0YURCiDlh4xnSpM', 'Mundo Chocolate Museo (MUCHO)'),
('ChIJfeEeIgT50YURzeICED4DBvI', 'Museo Kaluz'),
('ChIJfUlQ79L-0YURNEPcZuRl95I', 'Museo Foro Valparaiso'),
('ChIJg6EO8iz50YUR_zGPSn9s8Cw', 'Museo Interactivo de Economia (MIDE)'),
('ChIJGejuV8b_0YUR8n8674zMxRA', 'Instituto del Derecho de Asilo Museo Casa de Leon Trotsky'),
('ChIJgf9T6jr_0YUR-G4EP8imAQ0', 'Museo Nacional de Arquitectura'),
('ChIJH6lAZwD50YURP5b4Y-Kl-5o', 'Museo Vivo del Muralismo'),
('ChIJHR9WD-EBzoURC4jBlCSCY6o', 'Museo Nacional de la Estampa (MUNAE)'),
('ChIJHUMfYOcc0oURQnCEd9UDaNY', 'Museo de Cera de la CDMX'),
('ChIJhZtL4Yb_0YURtR8RljTZ4n4', 'Museo del Metro'),
('ChIJI4_tR83-0YURMouBJIUA4KY', 'Museo Nacional de Historia Castillo de Chapultepec'),
('ChIJI4_tR83-0YURwk0tscoXHrI', 'Palacio de la Escuela de Medicina'),
('ChIJIRo9WdX-0YUR8SAxEJ2aSHU', 'Museo Memoria y Tolerancia'),
('ChIJiZ9QW1UB0oURZCptjig7foQ', 'Cencalli: Casa del Maiz y la Cultura Alimentaria'),
('ChIJj1MJHVX_0YURor06_ZVMflI', 'Sala de Arte Publico Siqueiros'),
('ChIJJfEBfSv50YURaNP03IqAoyI', 'Museo Postal y Filatelico'),
('ChIJjQmjut8B0oUR5nxEUZGk94c', 'Museo Nacional de la Cartografia'),
('ChIJJRb-NJj50YURJyqLGmYUq0g', 'Museo Recinto Homenaje a Cuauhtemoc'),
('ChIJJyFpsUT90YURDA2u3YRehR8', 'Museo Yancuic'),
('ChIJjzC54CYB0oUR0zz7v4rDOAY', 'Museo del Axolote'),
('ChIJjZrXkGb_0YURtF6la-dRGVA', 'Museo Legislativo Sentimientos de la nacion'),
('ChIJKRwOy9L-0YURRykspU-RWlg', 'Museo del Estanquillo'),
('ChIJKZUuFTL50YURp7WDxJvywBg', 'Museo de la Inquisicion '),
('ChIJL7EfCzP50YURNvzmA7gabIU', 'Antiguo Colegio de San Ildefonso'),
('ChIJleF4wt__0YURjO850QiVZEc', 'Herbario Medicinal del IMSS'),
('ChIJLeheezz50YURsQP4V2EKOyw', 'Museo Indigena, Antigua Aduana de Peralvillo'),
('ChIJLxTLuyv_0YURCRoI4zag7pw', 'Museo Interactivo de la Bolsa Mexicana de Valores'),
('ChIJMTvb02P90YUR5QDHc13LDiA', 'Museo Barco Utopia'),
('ChIJMUgTY8z_0YURQVR0mAgAZYo', 'Museo Nacional de las Intervenciones'),
('ChIJmVP0CVr_0YURmK4FtqQ4H58', 'Galeria de Historia, Museo del Caracol'),
('ChIJmWvtmlUB0oUR8lMLFc3Z_9g', 'Ermita Vasco de Quiroga'),
('ChIJN2BnzIv50YURUYfYi1ka_XI', 'Museo del Perfume MUPE'),
('ChIJnb61RNX40YURjLOqxoI9oh0', 'Museo de Arte Popular'),
('ChIJncV3uir_0YURbye532FXQ5s', 'Museo de la Policia de la CDMX'),
('ChIJndV3ewAD0oURHLbzpioAvPI', 'Museo del Centenario del Ejercito Mexicano'),
('ChIJnfKdSGD_0YURkmQcI8nM2sY', 'Museo Casa de la Bola'),
('ChIJo2rf_Dr50YURflhLES6z-bM', 'Galeria Jose Maria Velasco'),
('ChIJocmS1Hb50YURhEbAOs6lnJo', 'Museo de Sitio de la SEP'),
('ChIJOUVaXAD50YURyRRNAbVQtcc', 'Museo de la Luz'),
('ChIJoXG9Uz4BzoURUh6XkUqgPmw', 'Museo Dolores Olmedo(cerrado)'),
('ChIJOz-6AMT_0YURofTM9_ekAWI', 'Museo Frida Kahlo'),
('ChIJP3q8QXsAzoUR1huFgqxLM7s', 'Museo del Palacio de Bellas Artes'),
('ChIJP7h8VS350YUR2YwWHaUnQ6s', 'Museo Mexicano del Diseño(MUMEDI)'),
('ChIJPeFdTboDzoUReHYVgKCKqis', 'Museo Flor De Chinampas'),
('ChIJpSvSWtL-0YURYtN_YgqJSyY', 'Museo del Instituto Cultural Mexico Israel'),
('ChIJpTd7X8b50YURCUXlhZyNa3o', 'Museo de Geologia y Paleontologia'),
('ChIJpUfl2Mz-0YUR0pYQ2SxQLwQ', 'Recinto de Homenaje a Don Benito Juarez'),
('ChIJpWjpqIEdzoUR_5NQ84zJNiI', 'Museo Regional Tlahuac'),
('ChIJPZ0pMG7_0YURtIMZk1CrgAc', 'Museo Nacional de la Vivienda(MUNAVI)'),
('ChIJQ16Y7f0BzoUR1qDtZh01mUE', 'Antiguo Convento de San Juan Evangelista sede del Centro Comunitario Culhuacan'),
('ChIJQ4_n5ZkBzoUR0UwxOJCjPPw', 'Pabellon Nacional de la Biodiversidad Museo Interactivo y espacio de investigacion'),
('ChIJq9Xzvcz40YURfmP3sO7YJMU', 'Museo Experimental El Eco'),
('ChIJqY5HNzP50YURxcqDF58XtuE', 'Ex Teresa Arte Actual'),
('ChIJQYhQEhn90YURWVngv2UZPuY', 'Museo Cabeza de Juarez'),
('ChIJrakwFqEbzoURhCutJf8FfLc', 'Museo Andres Quintana Roo'),
('ChIJRb4ejiz50YURqY1yJK7bolc', 'Museo del Ejercito y Fuerza Aerea Mexicanos de Bethlemitas(Cerrado)'),
('ChIJrQvKHwcAzoURvVdwzj9PUs8', 'Museo de Geologia'),
('ChIJRVkChvj_0YURriMSF4QlBf0', 'Museo de El Carmen'),
('ChIJRWueLTP50YURlCgtSyiZm14', 'Museo De Arte de la Secretaria de Hacienda y Credito Publico(SHCP)'),
('ChIJS0th0lP_0YURUhbp0wYZ1Cw', 'Museo de Arte Contemporaneo Internacional Rufino Tamayo'),
('ChIJs2qaH-_90YURPoYyZ3ZSlxA', 'Museo de las Culturas Pasion por Iztapalapa'),
('ChIJs6DFhML_0YURk-VPGr7p2GQ', 'Museo Nacional de Culturas Populares'),
('ChIJs8OirXr50YURN22sIs2jDrQ', 'Museo del Pulque y las Pulquerias'),
('ChIJScjIILQB0oURJMVub-MaI4Q', 'Museo Nacional de Antropologia (MNA)'),
('ChIJSSFclTr_0YUR4uD-2w2b-NA', 'Museo Ramon Lopez Velarde'),
('ChIJSXaFysz-0YUR_TmRjmzfMN0', 'Museo Nacional de las Culturas del Mundo'),
('ChIJSXVMZR7_0YUR7WmPmykd9MI', 'Museo Estelar'),
('ChIJs_N7ANL-0YUR72p7FaEep-Y', 'Museo Casa de la memoria Indomita'),
('ChIJt0XK4mz80YURbvemgOj7Jd4', 'Sala de Exposiciones de la Terminal 2 del Aeropuerto Internacional de la CDMX Benito Juarez'),
('ChIJt6361TL50YUReoAxC8jRs5o', 'Museo Galeria Nuestra Cocina Duque de Herdez'),
('ChIJtbnLX2MBzoUR2K50MPqhHps', 'Museo Casa Estudio Federico y Elsa'),
('ChIJTQGqdSv50YURJKLN5Eu1o3U', 'Museo de Arte Moderno(MAM)'),
('ChIJTR59T9L40YURq47GFMiDfFw', 'Museo Nacional de la Revolución'),
('ChIJUdDKBwD_0YURRdwGd4IIwR8', 'Museo Vizcainas'),
('ChIJudplNNwB0oURKjYZSfMoXfo', 'Mapoteca Manuel Orozco y Berra (MOB)'),
('ChIJv0LcYRoC0oURwXXz3593qE8', 'Museo Jumex'),
('ChIJV5TiG1D_0YUR_QVQFSGVq-4', 'Museo de Sitio y centro de Visitantes del Bosque de Chapultepec'),
('ChIJVdSfctMG0oURYDphYXTC1o4', 'Museo Panteon de San Fernando'),
('ChIJvf3-SdD50YURiYhl83ZX-Qo', 'Museo de Sitio CCEMX-INAH'),
('ChIJvfgLcDr_0YUR-HRX9JQ4MyM', 'Museo del Padre Pro'),
('ChIJVSETXR0A0oURnCpMTXsKQdw', 'Museo de Arte Alvar y Carmen T. de Carrillo Gil'),
('ChIJvUeFagsAzoURBMV2ubEDduI', 'Museo Universitario de Arte Contemporaneo (MUAC)'),
('ChIJVUhRqsX_0YURM5N_oeFJ4U8', 'Anfibium: Museo del Axolote y Centro de Conservacion de Anfibios'),
('ChIJVz3wFQ8D0oURyfa-VgrJ0bg', 'Museo de Azcapotzalco'),
('ChIJw0O77bAczoURlvZjcs4AtG4', 'Museo Regional Comunitario Cuitlahuac'),
('ChIJw3Q_96f_0YURF8GVbYAqrhE', 'Museo de Arte en Azucar Mexico'),
('ChIJw3_bJmX90YURJoXxUT9dn9A', 'Museo-Observatorio Interactivo de Hundimiento y Fracturamiento (OIHFRA)'),
('ChIJw4SugHAAzoURyRtoBBdxfAc', 'Museo de Sitio de Cuicuilco'),
('ChIJWbZn1c_40YURM2XEZgPFq54', 'Museo Universitario del Chopo'),
('ChIJwfLFtTIC0oURi1PLTQcchIk', 'Museo de la Brigada de Fusileros Paracaidistas'),
('ChIJx2oMq3AdzoURe-L8WOtsx5U', 'Museo Cielito Lindo'),
('ChIJX5_INNP-0YUR8jy2A5luR5I', 'Museo del Calzado El Borceguí'),
('ChIJX60b1aX_0YURZ8IH29uf4uo', 'Planetario Joaquin Gallo'),
('ChIJXa5Vx_n90YURs_lMS6srvdQ', 'Museo Fuego Nuevo'),
('ChIJXd8uYiz50YURLFjpXAHeFLQ', 'Museo del Telegrafo'),
('ChIJXRzWKqv_0YURFXq7yleGc8s', 'Casa Museo Benita Galeana '),
('ChIJxUpYS3UEzoURnTs95_pyS3I', 'Museo Arqueologico de Xochimilco'),
('ChIJxzpsvyz50YURVrAnhdu5pdc', 'Museo Art Toys'),
('ChIJy2TvI83-0YUR3g8_H4M519E', 'Museo de la CDMX'),
('ChIJY2WVmNX40YUReN3PtV1PvGQ', 'Museo Mural Diego Rivera'),
('ChIJy7l-qWEdzoURxEApXI86g8A', 'Museo Comunitario de San Miguel Teotongo'),
('ChIJYaC6M7z40YUR9ySdYt7ADdU', 'Museo de Caballeria'),
('ChIJyTUW3jL50YURKMKXNk1a184', 'Museo Archivo de la Fotografia (MAF)'),
('ChIJYW8DpNP-0YURiUmMwnN1i8Q', 'Museo de la Cancilleria'),
('ChIJYWPttNj-0YUR7jI4exTvVJc', 'Museo del Juguete Antiguo Mexico(MUJAM)'),
('ChIJZ-sKu1b_0YUR8dSsEqpreTY', 'Museo Casa de las mil muñecas'),
('ChIJzSrTeyT50YURo7DapMJZwy8', 'M68, Memorial 1968 y Movimientos Sociales'),
('ChIJZTMErjL-0YURBU8Dj-O1oYY', 'Museo del Ejercito y Fuerza Aerea '),
('ChIJzw7RuTT_0YURE2EXNI7CeCc', 'Museo Casa de Carranza'),
('ChIJZxLBKjL50YURn3B43HOh60Y', 'Museo de la Mujer'),
('ChIJzyWm13n50YURvis-A6vgIkw', 'Museo de la Basilica de Guadalupe'),
('ChIJ_7edOTP50YURTYRYfcHzjoE', 'Sala de la Odontologia Mexicana Dr. Samuel Fastlicht'),
('hIJ9_mnXTH50YURh7my4joJ0qQ', 'Museo Numismatico Nacional');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `museo_favorito`
--

CREATE TABLE `museo_favorito` (
  `id_Museo_Favorito` int(11) NOT NULL,
  `id_Turista` int(11) NOT NULL,
  `id_Museo` varchar(27) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `museo_visitado`
--

CREATE TABLE `museo_visitado` (
  `id_Museo_Visitado` int(11) NOT NULL,
  `id_Turista` int(11) NOT NULL,
  `id_Museo` varchar(27) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plan_museo`
--

CREATE TABLE `plan_museo` (
  `id_Plan_Museo` int(11) NOT NULL,
  `id_Museo` varchar(27) NOT NULL,
  `id_Plan` int(11) NOT NULL,
  `Posicion` int(11) NOT NULL DEFAULT 0,
  `MetodoTransporte` varchar(27) NOT NULL,
  `Estado` varchar(1) NOT NULL DEFAULT 'S'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plan_visita`
--

CREATE TABLE `plan_visita` (
  `id_Plan` int(11) NOT NULL,
  `id_Turista` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Duracion` time DEFAULT NULL,
  `hora_Finalizado` time DEFAULT NULL,
  `fecha_Creacion` date NOT NULL DEFAULT curdate(),
  `Estado` varchar(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_turista`
--

CREATE TABLE `usuario_turista` (
  `id` int(11) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `Apellido` varchar(30) NOT NULL,
  `Correo` varchar(50) NOT NULL,
  `Contrasena` varchar(60) NOT NULL,
  `Fecha_Nacimiento` date NOT NULL,
  `Estado_Cuenta` char(1) NOT NULL DEFAULT 'N',
  `Fecha_Registro` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id_Administrador`),
  ADD UNIQUE KEY `Correo` (`Correo`),
  ADD KEY `id_Museo` (`id_Museo`);

--
-- Indices de la tabla `anuncio`
--
ALTER TABLE `anuncio`
  ADD PRIMARY KEY (`id_Anuncio`),
  ADD KEY `id_Museo` (`id_Museo`),
  ADD KEY `id_Administrador` (`id_Administrador`);

--
-- Indices de la tabla `museo`
--
ALTER TABLE `museo`
  ADD PRIMARY KEY (`id_Museo`);

--
-- Indices de la tabla `museo_favorito`
--
ALTER TABLE `museo_favorito`
  ADD PRIMARY KEY (`id_Museo_Favorito`),
  ADD KEY `id_Turista` (`id_Turista`),
  ADD KEY `id_Museo` (`id_Museo`);

--
-- Indices de la tabla `museo_visitado`
--
ALTER TABLE `museo_visitado`
  ADD PRIMARY KEY (`id_Museo_Visitado`),
  ADD KEY `id_Turista` (`id_Turista`),
  ADD KEY `id_Museo` (`id_Museo`);

--
-- Indices de la tabla `plan_museo`
--
ALTER TABLE `plan_museo`
  ADD PRIMARY KEY (`id_Plan_Museo`),
  ADD KEY `id_Museo` (`id_Museo`),
  ADD KEY `id_Plan` (`id_Plan`);

--
-- Indices de la tabla `plan_visita`
--
ALTER TABLE `plan_visita`
  ADD PRIMARY KEY (`id_Plan`),
  ADD KEY `id_Turista` (`id_Turista`);

--
-- Indices de la tabla `usuario_turista`
--
ALTER TABLE `usuario_turista`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Correo` (`Correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administrador`
--
ALTER TABLE `administrador`
  MODIFY `id_Administrador` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `anuncio`
--
ALTER TABLE `anuncio`
  MODIFY `id_Anuncio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `museo_favorito`
--
ALTER TABLE `museo_favorito`
  MODIFY `id_Museo_Favorito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `museo_visitado`
--
ALTER TABLE `museo_visitado`
  MODIFY `id_Museo_Visitado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `plan_museo`
--
ALTER TABLE `plan_museo`
  MODIFY `id_Plan_Museo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `plan_visita`
--
ALTER TABLE `plan_visita`
  MODIFY `id_Plan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario_turista`
--
ALTER TABLE `usuario_turista`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD CONSTRAINT `administrador_ibfk_1` FOREIGN KEY (`id_Museo`) REFERENCES `museo` (`id_Museo`);

--
-- Filtros para la tabla `anuncio`
--
ALTER TABLE `anuncio`
  ADD CONSTRAINT `anuncio_ibfk_1` FOREIGN KEY (`id_Museo`) REFERENCES `museo` (`id_Museo`),
  ADD CONSTRAINT `anuncio_ibfk_2` FOREIGN KEY (`id_Administrador`) REFERENCES `administrador` (`id_Administrador`) ON DELETE CASCADE;

--
-- Filtros para la tabla `museo_favorito`
--
ALTER TABLE `museo_favorito`
  ADD CONSTRAINT `museo_favorito_ibfk_1` FOREIGN KEY (`id_Turista`) REFERENCES `usuario_turista` (`id`),
  ADD CONSTRAINT `museo_favorito_ibfk_2` FOREIGN KEY (`id_Museo`) REFERENCES `museo` (`id_Museo`);

--
-- Filtros para la tabla `museo_visitado`
--
ALTER TABLE `museo_visitado`
  ADD CONSTRAINT `museo_visitado_ibfk_1` FOREIGN KEY (`id_Turista`) REFERENCES `usuario_turista` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `museo_visitado_ibfk_2` FOREIGN KEY (`id_Museo`) REFERENCES `museo` (`id_Museo`);

--
-- Filtros para la tabla `plan_museo`
--
ALTER TABLE `plan_museo`
  ADD CONSTRAINT `plan_museo_ibfk_1` FOREIGN KEY (`id_Museo`) REFERENCES `museo` (`id_Museo`),
  ADD CONSTRAINT `plan_museo_ibfk_2` FOREIGN KEY (`id_Plan`) REFERENCES `plan_visita` (`id_Plan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `plan_visita`
--
ALTER TABLE `plan_visita`
  ADD CONSTRAINT `plan_visita_ibfk_1` FOREIGN KEY (`id_Turista`) REFERENCES `usuario_turista` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
