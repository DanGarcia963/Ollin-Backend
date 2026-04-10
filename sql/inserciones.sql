insert into usuario_turista (Nombre, Apellido, Correo, Contrasena, Fecha_Nacimiento, Estado_Cuenta) values ("Angel", "Contreras", "ar.contreras372@gmail.com", "12345", DATE '2003-07-02', "Y");
insert into itinerario (Nombre, Apellido, Correo, Contrasena, Fecha_Nacimiento, Estado_Cuenta) values ("Angel", "Contreras", "ar.contreras372@gmail.com", "12345", DATE '2003-07-02', "Y");

select * from usuario_turista;

select * from lugar_itinerario order by Posicion asc;

update lugar_itinerario set Posicion = 1  where id_Lugar_Itinerario = 1;
update lugar_itinerario set Posicion = 2  where id_Lugar_Itinerario = 2;