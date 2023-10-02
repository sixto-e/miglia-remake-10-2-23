const pool = require('./../util/baseDatos')

const TABLA_CLIENTES = 'CLIENTES';
const PROVINCIAS = "PROVINCIAS";
const SEMAFORO_COMERC = "SEMAFOROS_COMERCIALES"
const TABLA_INTERACCIONES = "INTERACCIONES";
const TABLA_INTERES = "INTERES_EN";
const INT_ESTADO = "INTER_ESTADO";
const TIPO_MAQUINARIAS = "MAQ_TIPOS";
const MAQ_DISPONIBILIDAD = "MAQ_DISPONIBILIDAD";
const MAQ_ESTADO = "MAQ_ESTADO";
const MAQ_MODALIDAD = "MAQ_MODALIDAD";
const MAQUINARIA = "MAQUINARIA";
const TABLA_USUARIOS = 'USUARIOS';//ya no es vendedores, si no, empleados; ya que es un concepto mas abarcativo.
const ZONA_COMERCIAL = "ZONA_COMERCIAL";
const TIPOS_USUARIOS = "TIPOS_USUARIOS"
const PERFILES_USUARIOS = "PERFILES_USUARIOS";
const TIEMPO_EN_APP = "TIEMPO_EN_LA_APP"
const TABLA_MAQ_GALERIA = "MAQ_GALERIA"

// USUARIOS

const convertir_usuario_a_admin = async (id) => {
    try {
        const query = "UPDATE ?? SET rol = 1 WHERE id = ?";
        const params = [TABLA_USUARIOS, id];
        return await pool.query(query, params)
    } catch (e) {
        console.log(e);
    }
}

const convertir_usuario_a_editor = async (id) => {
    try {
        const query = "UPDATE ?? SET rol = 2 WHERE id = ?";
        const params = [TABLA_USUARIOS, id];
        return await pool.query(query, params)
    } catch (e) {
        console.log(e);
    }
}


const listar_usuarios = async (estado) => {
    try {
        const query = `
  
      SELECT user.id, user.nombre, user.telefono, user.mail, user.ubicacion, t_users.t_descrip, z_comer.z_descrip, p_user.p_descrip 
  
      FROM USUARIOS AS user
  
      LEFT JOIN TIPOS_USUARIOS AS t_users ON t_users.id_tipo = user.rol
  
      LEFT JOIN ZONA_COMERCIAL AS z_comer ON z_comer.id_zona = user.zona_comercial 
  
      LEFT JOIN PERFILES_USUARIOS AS p_user ON p_user.id_perfil = user.perfil
  
      WHERE user.habilitado = ?  ORDER BY user.nombre ASC`

            ;
        const params = [estado];
        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}

const crear_usuario = async (obj) => {
    try {
        const query = "INSERT INTO ?? SET ? ";
        const params = [TABLA_USUARIOS, obj];
        return await pool.query(query, params)
    }
    catch (e) {
        console.log(e);
    }
}


const obtener_zonas_comerciales = async () => {
    try {
        const query = "SELECT * FROM ??";
        const params = [ZONA_COMERCIAL];
        return await pool.query(query, params)

    } catch (e) {
        console.log(e);
    }
}



const obtener_roles_usuarios = async () => {
    try {
        const query = "SELECT * FROM ??";
        const params = [TIPOS_USUARIOS];
        return await pool.query(query, params)
    } catch (e) {
        console.log(e);
    }
}


const obtener_perfiles_usuarios = async () => {
    try {
        const query = "SELECT * FROM ??"
        const params = [PERFILES_USUARIOS];
        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}


// Para verificar si e un empleado con los mismo datos y en consecuencia no duplicar los datos.
const verificar_existencia_de_usuario = async (correo) => {
    try {
        const query = "SELECT user.mail, user.contraseña as pass, user.rol, user.id FROM ?? AS user WHERE  user.mail = ? AND user.habilitado = TRUE";
        const params = [TABLA_USUARIOS, correo];
        return await pool.query(query, params);


    } catch (e) {
        console.log(e);
    }

}

// Elimina un usuario
const borrar_usuario = async (id, estado) => {
    try {
        const query = "UPDATE ?? SET habilitado = ? WHERE id = ?"
        const params = [TABLA_USUARIOS, estado, id]
        return await pool.query(query, params)
    }
    catch (e) {
        console.log(e);
    }

}


// Agarra un solo usuario
const single_usuario = async (id, estado) => {
    try {
        const query = `
  
      SELECT user.id, user.nombre, user.telefono, user.mail, user.ubicacion, t_users.t_descrip, z_comer.z_descrip, p_user.p_descrip 
  
      FROM USUARIOS AS user
  
      LEFT JOIN TIPOS_USUARIOS AS t_users ON t_users.id_tipo = user.rol
  
      LEFT JOIN ZONA_COMERCIAL AS z_comer ON z_comer.id_zona = user.zona_comercial 
  
      LEFT JOIN PERFILES_USUARIOS AS p_user ON p_user.id_perfil = user.perfil
  
      WHERE user.id = ? AND user.habilitado = ? `;

        const params = [id, estado];

        return await pool.query(query, params);
    }
    catch (e) {
        console.log(e);
    }
}


//  Editar un usuario
const editar_usuario = async (id, obj) => {
    try {
        const query = "UPDATE ?? SET ? WHERE id = ?";
        const params = [TABLA_USUARIOS, obj, id];
        return await pool.query(query, params);

    }
    catch (e) {
        console.log(e);
    }
}

// Obten id, descrip de TIPOS_USUARIOS usando como parámtro la descripción.
const obtener_data_desde_tabla_tipos_usuarios = async (descrip) => {
    try {
        const query = "SELECT * FROM ?? WHERE t_descrip = ?";
        const params = [TIPOS_USUARIOS, descrip];
        return await pool.query(query, params)
    } catch (e) {
        console.log(e);
    }
}

const obtener_data_desde_tabla_zona_comercial = async (descrip) => {
    try {
        const query = "SELECT * FROM ?? WHERE z_descrip = ?";
        const params = [ZONA_COMERCIAL, descrip];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}


const obtener_data_desde_tabla_perfiles_usuarios = async (descrip) => {
    try {
        const query = "SELECT * FROM ?? WHERE p_descrip = ?";
        const params = [PERFILES_USUARIOS, descrip];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

// Para guardar el tiempo que el usuario para en la app por día
const guardar_tiempo_en_la_app = async (datos_a_almacenar) => {
    try {
        const query = "INSERT INTO ?? SET ?";
        const params = [TIEMPO_EN_APP, datos_a_almacenar];
        return await pool.query(query, params)
    } catch (e) {
        console.log(e);
    }
}


const obtener_contraseña = async (id) => {
    try {
        const query = "SELECT contraseña as pass FROM ?? WHERE id = ? AND habilitado = true";
        const params = [TABLA_USUARIOS, id];
        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}


const actualizar_contraseña = async (pass_nueva_encriptada, id_usuario) => {
    try {
        const query = "UPDATE ?? SET contraseña = ? WHERE id = ?";
        const params = [TABLA_USUARIOS, pass_nueva_encriptada, id_usuario];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }

}

// CLIENTES
const crear_cliente = async (obj) => {
    try {
        const query = "INSERT INTO ?? SET ?";
        const params = [TABLA_CLIENTES, obj];
        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}

const verificar_si_el_cuit_del_cliente_ya_existe = async (cuit) => {
    try {
        const query = "SELECT cuit FROM ?? WHERE cuit = ?";
        const params = [TABLA_CLIENTES, cuit];
        return await pool.query(query, params)
    } catch (e) {
        console.log(e);
    }
}

const single_cliente = async (id, habilitado) => {
    try {
        const query = "SELECT cli.* FROM ?? AS cli WHERE cli.id = ? AND cli.habilitado = ?";
        const params = [TABLA_CLIENTES, id, habilitado];
        return await pool.query(query, params);


    } catch (e) {
        console.log(e);
    }
}


const obtener_listado_de_clientes = async (habilitado) => {
    try {
        const query = `SELECT p.prov_descrip, sc.sem_descrip, c.* FROM CLIENTES c
    LEFT JOIN PROVINCIAS AS p ON p.id = c.provincia
    LEFT JOIN SEMAFOROS_COMERCIALES AS sc ON sc.id = c.semaforo_comercial
    WHERE habilitado = ? ORDER BY c.razon_social ASC`;
        const params = [habilitado];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

const editar_cliente = async (nueva_data, id_cliente) => {
    try {
        const query = "UPDATE ?? SET ? WHERE id = ?";
        const params = [TABLA_CLIENTES, nueva_data, id_cliente];
        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}

const borrar_cliente = async (habilitado, id) => {
    try {
        const query = "UPDATE ??  SET habilitado = ? WHERE id = ?";
        const params = [TABLA_CLIENTES, habilitado, id];
        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}

const buscar_cliente_por_cuit = async (cuit, habilitado) => {
    try {
        const query = "SELECT * FROM ?? WHERE cuit = ? AND habilitado = ?";
        const params = [TABLA_CLIENTES, cuit, habilitado];
        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}

const listado_de_provincias = async () => {
    try {
        const query = "SELECT * FROM ??";
        const params = [PROVINCIAS];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

const semaforos = async () => {
    try {
        const query = "SELECT * FROM ??";
        const params = [SEMAFORO_COMERC];
        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}

const obtener_provincia_por_id = async (id) => {
    try {
        const query = "SELECT id as id_prov, prov_descrip FROM ?? WHERE id = ?";
        const params = [PROVINCIAS, id];
        return await pool.query(query, params)
    } catch (e) {
        console.log(e);
    }
}


const obtener_semaforo_por_id = async (id) => {
    try {

        const query = "SELECT * FROM ?? WHERE id = ?";
        const params = [SEMAFORO_COMERC, id];
        return await pool.query(query, params)

    } catch (e) {
        console.log(e);
    }
}


const buscar_cliente_ = async (razon_social, contact, cuit, localidad, habilitado) => {
    try {
        const query = 'SELECT cli.* FROM ?? AS cli WHERE (cli.nombre_contacto LIKE "%"?"%" OR cli.razon_social LIKE "%"?"%" OR cli.cuit LIKE ? OR cli.localidad = ?) AND cli.habilitado = ?';

        const params = [TABLA_CLIENTES, razon_social, contact, cuit, localidad, habilitado];

        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}

// INTERACCIONES 

const cant_interaciones_en_curso = async () => {
    try {
        const query = "SELECT COUNT(*) FROM INTERACCIONES WHERE estado_interaccion = 1";
        return await pool.query(query);
    } catch (e) {
        console.log(e);
    }
}

const cant_interaciones_concretadas = async () => {
    try {
        const query = "SELECT COUNT(*) FROM INTERACCIONES WHERE estado_interaccion = 4";
        return await pool.query(query);
    } catch (e) {
        console.log(e);
    }
}


const cant_interaciones_pendientes = async () => {
    try {
        const query = "SELECT COUNT(*) FROM INTERACCIONES WHERE estado_interaccion = 2";
        return await pool.query(query);
    } catch (e) {
        console.log(e);
    }
}


const cant_interaciones_canceladas = async () => {
    try {
        const query = "SELECT COUNT(*) FROM INTERACCIONES WHERE estado_interaccion = 3";
        return await pool.query(query);
    } catch (e) {
        console.log(e);
    }
}


const seleccionar_estados_de_interaccion = async () => {
    try {
        const query = "SELECT * FROM ??";
        const params = [INT_ESTADO];
        return await pool.query(query, params)
    } catch (e) {
        console.log(e);
    }
}


const crear_interaccion = async (data) => {
    try {
        const query = "INSERT INTO ?? SET ?";
        const params = [TABLA_INTERACCIONES, data];
        return await pool.query(query, params)
    } catch (e) {
        console.log(e);
    }
}

const seleccionar_intereacciones = async () => {
    try {
        const query = `
        SELECT 
            DATE_FORMAT(inter.prox_contacto, '%d-%m-%y') AS prox_encuentro,
            inter.id AS id_interaccion,
            DATE_FORMAT(inter.ts_create, '%d-%m-%y') AS dia_de_interaccion,
            int_est.descrip as estado_inter,
            int_en.descrip as interes,
            est.descrip as estado,
            mq.tipo,
            us.nombre,
            cli.*

        FROM 
            INTERACCIONES inter
            JOIN CLIENTES cli ON inter.id_cliente = cli.id
            JOIN INTER_ESTADO int_est ON inter.estado_interaccion = int_est.id
            JOIN USUARIOS us ON inter.id_user_responsable = us.id
            JOIN INTERES_EN int_en ON inter.interes_en = int_en.id
            JOIN MAQ_ESTADO est ON inter.estado = est.id
            JOIN MAQ_TIPOS mq ON inter.tipo = mq.id
            WHERE inter.habilitado = TRUE
            ORDER BY prox_encuentro ASC
            `;

        return await pool.query(query);
    } catch (e) {
        console.log(e);
    }
}


const selecciones_de_interes = async (req, res) => {
    try {
        const query = "SELECT * FROM ??";
        const params = [TABLA_INTERES];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}


const obtener_id_del_cliente_usando_cuit = async (cuit) => {
    try {
        const query = "SELECT id FROM ?? WHERE cuit = ?";
        const params = [TABLA_CLIENTES, cuit];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}



const obterner_semaforo_por_su_id = async (id) => {
    try {
        const query = "SELECT sem_descrip FROM ?? WHERE id = ?";
        const params = [SEMAFORO_COMERC, id];
        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}




const obtener_provincia_por_su_id = async (id) => {
    try {
        const query = "SELECT prov_descrip FROM ?? WHERE id = ?";
        const params = [PROVINCIAS, id];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}


const seleccionar_clientes_habilitados = async () => {
    try {
        const query = `
        SELECT *
        FROM ??
        WHERE habilitado = 1
        ORDER BY SUBSTRING(razon_social, 1, 1) ASC, razon_social ASC;
        `;
        const params = [TABLA_CLIENTES];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

const data_cliente_para_interaccion = async (id_del_cliente_a_buscar) => {
    try {
        const query = "SELECT * FROM ?? WHERE id = ?";
        const params = [TABLA_CLIENTES, id_del_cliente_a_buscar];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}


const listar_interaccion = async (id) => {
    try {
        const query = `

        SELECT 

            DATE_FORMAT(inter.prox_contacto, '%d-%m-%y') AS prox_encuentro,
            DATE_FORMAT(inter.ts_create, '%d-%m-%y') AS dia_de_interaccion,
            inter.id AS id_interaccion,
            inter.observacion as observacion_interaccion,
            int_est.id as id_estado_inter,
            int_est.descrip as estado_inter,
            int_en.id as id_interes_en,
            int_en.descrip as interes,
            est.id as id_estado_maq,
            est.descrip as estado,
            mq.tipo,
            mq.id as id_tipo,
            us.id as id_responsable,
            us.nombre as responsable,
            cli.*

        FROM 
            INTERACCIONES inter
            JOIN CLIENTES cli ON inter.id_cliente = cli.id
            JOIN INTER_ESTADO int_est ON inter.estado_interaccion = int_est.id
            JOIN USUARIOS us ON inter.id_user_responsable = us.id
            JOIN INTERES_EN int_en ON inter.interes_en = int_en.id
            JOIN MAQ_ESTADO est ON inter.estado = est.id
            JOIN MAQ_TIPOS mq ON inter.tipo = mq.id
            WHERE inter.id = ? 
            `;
        const params = [id];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}


const seleccionar_interacciones_por_estado = async (id_estado) => {
    try {
        const query = `
        SELECT 
            DATE_FORMAT(inter.prox_contacto, '%d-%m-%y') AS prox_encuentro,
            DATE_FORMAT(inter.ts_create, '%d-%m-%y') AS dia_de_interaccion,
            inter.id AS id_interaccion,
            int_est.descrip as estado_inter,
            int_en.descrip as interes,
            est.descrip as estado,
            mq.tipo,
            us.nombre as responsable,
            cli.*

        FROM 
            INTERACCIONES inter
            JOIN CLIENTES cli ON inter.id_cliente = cli.id
            JOIN INTER_ESTADO int_est ON inter.estado_interaccion = int_est.id
            JOIN USUARIOS us ON inter.id_user_responsable = us.id
            JOIN INTERES_EN int_en ON inter.interes_en = int_en.id
            JOIN MAQ_ESTADO est ON inter.estado = est.id
            JOIN MAQ_TIPOS mq ON inter.tipo = mq.id
            WHERE estado_interaccion = ? AND inter.habilitado = 1
            ORDER BY prox_encuentro ASC
            `;
        const params = [id_estado];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

const cambiar_estado_de_una_interaccion = async (estado, id) => {
    try {
        const query = "UPDATE ?? SET habilitado = ? WHERE id = ?";
        const params = [TABLA_INTERACCIONES, estado, id];
        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}


const actualizar_una_interaccion = async (info, id) => {
    try {
        const query = "UPDATE ?? SET ? WHERE id = ?";
        const params = [TABLA_INTERACCIONES, info, id];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}


const seleccionar_tareas = async () => {
    try {
        const query = `
     
        SELECT 
            DATE_FORMAT(inter.prox_contacto, '%d-%m-%y') AS prox_encuentro,
            DATE_FORMAT(inter.ts_create, '%d-%m-%y') AS dia_de_interaccion,
            inter.id AS id_interaccion,
            int_est.descrip as estado_inter,
            int_en.descrip as interes,
            est.descrip as estado,
            mq.tipo,
            us.nombre as responsable,
            cli.*

        FROM 
            INTERACCIONES inter
            JOIN CLIENTES cli ON inter.id_cliente = cli.id
            JOIN INTER_ESTADO int_est ON inter.estado_interaccion = int_est.id
            JOIN USUARIOS us ON inter.id_user_responsable = us.id
            JOIN INTERES_EN int_en ON inter.interes_en = int_en.id
            JOIN MAQ_ESTADO est ON inter.estado = est.id
            JOIN MAQ_TIPOS mq ON inter.tipo = mq.id
            WHERE inter.habilitado = TRUE AND (estado_interaccion = 1 or estado_interaccion = 2)
            ORDER BY prox_encuentro ASC
            `;

        return await pool.query(query);
    } catch (e) {
        console.log(e);
    }

}


const obtener_interacciones_de_un_usuario = async (id_user) => {
    try {
        const query = `
        SELECT 
            DATE_FORMAT(inter.prox_contacto, '%d-%m-%y') AS prox_encuentro,
            DATE_FORMAT(inter.ts_create, '%d-%m-%y') AS dia_de_interaccion,
            inter.id AS id_interaccion,
            int_est.descrip as estado_inter,
            int_en.descrip as interes,
            est.descrip as estado,
            mq.tipo,
            us.nombre as responsable,
            cli.*

        FROM 
            INTERACCIONES inter
            JOIN CLIENTES cli ON inter.id_cliente = cli.id
            JOIN INTER_ESTADO int_est ON inter.estado_interaccion = int_est.id
            JOIN USUARIOS us ON inter.id_user_responsable = us.id
            JOIN INTERES_EN int_en ON inter.interes_en = int_en.id
            JOIN MAQ_ESTADO est ON inter.estado = est.id
            JOIN MAQ_TIPOS mq ON inter.tipo = mq.id
            WHERE inter.habilitado = TRUE AND inter.id_user_responsable = ?
            ORDER BY prox_encuentro ASC
            `;
        const params = [id_user]
        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}

const filtrar_tareas_por_id_usuario = async (id_user) => {
    try {
        const query =
            `
        SELECT
            DATE_FORMAT(inter.prox_contacto, '%d-%m-%y') AS prox_encuentro,
            DATE_FORMAT(inter.ts_create, '%d-%m-%y') AS dia_de_interaccion,
            inter.id AS id_interaccion,
            int_est.descrip as estado_inter,
            int_en.descrip as interes,
            est.descrip as estado,
            mq.tipo,
            us.nombre as responsable,
            cli.*

            FROM INTERACCIONES inter

            JOIN CLIENTES cli ON inter.id_cliente = cli.id
            JOIN INTER_ESTADO int_est ON inter.estado_interaccion = int_est.id
            JOIN USUARIOS us ON inter.id_user_responsable = us.id
            JOIN INTERES_EN int_en ON inter.interes_en = int_en.id
            JOIN MAQ_ESTADO est ON inter.estado = est.id
            JOIN MAQ_TIPOS mq ON inter.tipo = mq.id
            WHERE inter.habilitado = TRUE AND (estado_interaccion = 1 or estado_interaccion = 2)  AND  inter.id_user_responsable = ? 
            ORDER BY prox_encuentro ASC
            `;
        const params = [id_user];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}




// TODO SOBRE MAQUINARIA

const verificar_si_hay_tipos_repetidos = async (tipo) => {
    try {
        const query = "SELECT id FROM ?? WHERE tipo = ?";
        const params = [TIPO_MAQUINARIAS, tipo];
        return await pool.query(query, params);
    } catch (e) {
        console.log((e));
    }
}

const cant_maq_0km = async () => {
    try {
        const query = "SELECT COUNT(*) FROM MAQUINARIA WHERE fk_estado = 1";
        return await pool.query(query);
    } catch (e) {
        console.log(e);
    }
}
const cant_maq_muy_buena = async () => {
    try {
        const query = "SELECT COUNT(*) FROM MAQUINARIA WHERE fk_estado = 2";
        return await pool.query(query);
    } catch (e) {
        console.log(e);
    }
}

const cant_maq_regular = async () => {
    try {
        const query = "SELECT COUNT(*) FROM MAQUINARIA WHERE fk_estado = 3 ";
        return await pool.query(query);
    } catch (e) {
        console.log(e);
    }
}

const cant_maq_buen_estado = async () => {
    try {
        const query = "SELECT COUNT(*) FROM MAQUINARIA WHERE fk_estado = 4";
        return await pool.query(query);
    } catch (e) {
        console.log(e);
    }
}


const cant_maq_a_supervisar = async () => {
    try {
        const query = "SELECT COUNT(*) FROM MAQUINARIA WHERE fk_estado = 5 ";
        return await pool.query(query);
    } catch (e) {
        console.log(e);
    }
}

const mayor_interes_en_estas_maquinas = async () => {
    try {
        const query =
            `SELECT 
            t.tipo, COUNT(*) AS cantidad
        FROM INTERACCIONES AS I
        INNER JOIN MAQ_TIPOS AS t ON I.tipo = t.id
        GROUP BY t.tipo;`;
        return await pool.query(query);
    } catch (e) {
        console.log(e);
    }
}



const seleccionar_maquinaria = async (estado) => {
    try {
        const query = `
    SELECT
        m.id AS id_maquinaria,
        m.precio, 
        m.modelo,
        DATE_FORMAT(m.ts_create, '%d-%m-%y') AS fecha_de_creacion,
        tm.tipo,
        tm.id,
        mo.descrip AS modalidad,
        d.descrip AS disponibilidad,
        e.descrip AS estado
     FROM
        MAQUINARIA as m
        JOIN MAQ_TIPOS as tm ON m.fk_tipo = tm.id
        JOIN MAQ_MODALIDAD as mo ON m.fk_modalidad = mo.id
        JOIN MAQ_DISPONIBILIDAD as  d ON m.fk_disponibilidad = d.id
        JOIN MAQ_ESTADO as e ON m.fk_estado = e.id
     WHERE
        m.habilitado = ?
        ORDER BY tm.id ASC, m.modelo ASC` ;
        const params = [estado];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

const buscar_maquinaria = async (id_tipo_maq) => {
    try {
        const query = `
        SELECT
            m.id AS id_maquinaria,
            m.precio, 
            m.modelo,
            DATE_FORMAT(m.ts_create, '%d-%m-%y') AS fecha_de_creacion,
            tm.tipo,
            mo.descrip AS modalidad,
            d.descrip AS disponibilidad,
            e.descrip AS estado
        FROM
            MAQUINARIA m
            JOIN MAQ_TIPOS tm ON m.fk_tipo = tm.id
            JOIN MAQ_MODALIDAD mo ON m.fk_modalidad = mo.id
            JOIN MAQ_DISPONIBILIDAD d ON m.fk_disponibilidad = d.id
            JOIN MAQ_ESTADO e ON m.fk_estado = e.id
        WHERE
            m.habilitado = 1 
            AND m.fk_tipo = ?; 
`
        const params = [id_tipo_maq];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

const cargar_maquinaria = async (obj) => {
    try {
        const query = "INSERT INTO ?? SET ?";
        const params = [MAQUINARIA, obj];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

const single_maquinaria = async (id, estado) => {
    try {
        const query = `
    SELECT
        m.*,
        m.id AS id_maquinaria,
        m.precio, 
        m.modelo,
        tm.tipo,
        mo.descrip AS modalidad,
        d.descrip AS disponibilidad,
        e.descrip AS estado
     
     FROM
        MAQUINARIA m
        JOIN MAQ_TIPOS tm ON m.fk_tipo = tm.id
        JOIN MAQ_MODALIDAD mo ON m.fk_modalidad = mo.id
        JOIN MAQ_DISPONIBILIDAD d ON m.fk_disponibilidad = d.id
        JOIN MAQ_ESTADO e ON m.fk_estado = e.id
       
     WHERE
        m.id = ?    
        AND m.habilitado = ?

     
        ` ;
        const params = [id, estado];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

// Todos los datos de una máquina específica --- Galería de fotos
const fotosGaleria = async (id) => {
    try {
      const query = "SELECT * FROM ?? WHERE id_maquina = ? AND habilitado = 1";
      const params = [TABLA_MAQ_GALERIA, id];
      return await pool.query(query, params);
    } catch (e) {
      console.log(e);
    }
  }


const borrar_habilitar_maq = async (estado, id) => {
    try {
        const query = "UPDATE ?? SET habilitado = ? WHERE id = ?";
        const params = [MAQUINARIA, estado, id];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}





// TODO SOBRE MAQUINARIA MODALIDAD
const seleccionar_modalidad = async () => {
    try {
        const query = "SELECT * FROM ??";
        const params = [MAQ_MODALIDAD];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}


// TODO SOBRE MAQUINARIA ESTADO
const seleccionar_estado = async () => {
    try {
        const query = "SELECT * FROM ??";
        const params = [MAQ_ESTADO];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}


// TODO SOBRE MAQUINARIA DISPONIBILIDAD
const seleccionar_disponibilidad = async () => {
    try {
        const query = "SELECT * FROM ?? LIMIT 2";
        const params = [MAQ_DISPONIBILIDAD];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

// TODO SOBRE TIPO DE MAQUINARIA
const crear_tipo_de_maquinaria = async (obj) => {
    try {
        const query = "INSERT INTO ?? SET ?";
        const params = [TIPO_MAQUINARIAS, obj];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

const editar_tipo_maquinaria = async (obj, id) => {
    try {
        const query = "UPDATE ?? SET ? WHERE id = ?";
        const params = [TIPO_MAQUINARIAS, obj, id];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

const habitar_borrar_tipo = async (estado, id) => {
    try {
        const query = "UPDATE ?? SET habilitado = ? WHERE id = ?";
        const params = [TIPO_MAQUINARIAS, estado, id];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

const listado_tipo_maquinarias = async (estado) => {
    try {
        const query = "SELECT * FROM ?? WHERE habilitado = ?";
        const params = [TIPO_MAQUINARIAS, estado];
        return await pool.query(query, params);

    } catch (e) {
        console.log(e);
    }
}

const single_tipo_maq = async (id) => {
    try {
        const query = "SELECT * FROM ?? WHERE id = ?";
        const params = [TIPO_MAQUINARIAS, id];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

const editar_maquinaria = async (obj, id) => {
    try {
        const query = "UPDATE ?? SET ? WHERE id = ?";
        const params = [MAQUINARIA, obj, id];
        return await pool.query(query, params)
    } catch (e) {
        console.log(e);
    }
}


// Agregar una foto destacada 
const setImage = async (foto, id) => {
    try {
        const query = "UPDATE ?? SET foto = ? WHERE id = ?";
        const params = [MAQUINARIA, foto, id];
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}
// ORDER BY tm.id ASC, m.modelo ASC. Lo ordeno igual que el listado de máquinas, asi coinciden las fotos
const getFotos = async () => {
    try {
        const query =
        `
        SELECT m.foto 
        FROM ?? m JOIN ?? tm ON m.fk_tipo = tm.id 
        WHERE m.habilitado = true 
        ORDER BY tm.id ASC, m.modelo ASC`;

        const params = [MAQUINARIA, TIPO_MAQUINARIAS]
        return await pool.query(query, params);
    } catch (e) {
        console.log(e);
    }
}

// Recordar que estas fotos son solo para una máquina.
// Además, remarcamos la diferencia entra máquina y tipo de máquina.
// Agregar fotos a la galería.
const addFoto = async (obj) => {
    try {
      const query = "INSERT INTO ?? SET ?";
      const params = [TABLA_MAQ_GALERIA, obj];
      return await pool.query(query, params);
    } catch (e) {
      console.log(e);
    }
  }


module.exports = {


    // Funciones relacionadas a USUARIOS.
    obtener_zonas_comerciales, obtener_roles_usuarios, obtener_perfiles_usuarios, verificar_existencia_de_usuario, crear_usuario,

    listar_usuarios, borrar_usuario, single_usuario, editar_usuario, obtener_data_desde_tabla_tipos_usuarios,

    obtener_data_desde_tabla_zona_comercial, obtener_data_desde_tabla_perfiles_usuarios, guardar_tiempo_en_la_app,

    obtener_contraseña, actualizar_contraseña, obtener_interacciones_de_un_usuario, convertir_usuario_a_admin, convertir_usuario_a_editor,


    // Interacciones
    actualizar_una_interaccion, seleccionar_tareas, filtrar_tareas_por_id_usuario,

    seleccionar_interacciones_por_estado, cambiar_estado_de_una_interaccion,

    seleccionar_estados_de_interaccion, seleccionar_intereacciones, crear_interaccion, selecciones_de_interes,

    obtener_id_del_cliente_usando_cuit,

    seleccionar_clientes_habilitados, data_cliente_para_interaccion, listar_interaccion,

    obtener_provincia_por_su_id, obterner_semaforo_por_su_id,

    cant_interaciones_en_curso, cant_interaciones_pendientes, cant_interaciones_canceladas, cant_interaciones_concretadas,


    cant_maq_0km, cant_maq_muy_buena, cant_maq_regular, cant_maq_buen_estado, cant_maq_a_supervisar, mayor_interes_en_estas_maquinas,


    // Clientes
    crear_cliente, editar_cliente, borrar_cliente, obtener_listado_de_clientes,

    verificar_si_el_cuit_del_cliente_ya_existe, single_cliente,

    buscar_cliente_por_cuit,

    listado_de_provincias, semaforos,

    obtener_provincia_por_id, obtener_semaforo_por_id,

    buscar_cliente_,


    // MAQUINARIAS
    crear_tipo_de_maquinaria, editar_tipo_maquinaria, habitar_borrar_tipo, listado_tipo_maquinarias, single_tipo_maq,

    seleccionar_disponibilidad, seleccionar_estado, seleccionar_modalidad,

    seleccionar_maquinaria, cargar_maquinaria, single_maquinaria, borrar_habilitar_maq, verificar_si_hay_tipos_repetidos,

    editar_maquinaria, buscar_maquinaria, setImage, getFotos, addFoto, fotosGaleria

}
