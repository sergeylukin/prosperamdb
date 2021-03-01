'use strict';
const fs = require('fs-extra')
const path = require( 'path' );
/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */
async function findPublicRole() {
  const result = await strapi
  .query("role", "users-permissions")
  .findOne({ type: "public" });
  return result;
};

async function setDefaultPublicPermissions(controller, permissionsWhitelist) {
  const role = await findPublicRole();
  const permissions = await strapi
  .query("permission", "users-permissions")
  .find({ type: "application", role: role.id });
  await Promise.all(
    permissions.map(p => {
                    if (permissionsWhitelist.indexOf(p.action) !== -1 && controller == p.controller) {
                      strapi
                      .query("permission", "users-permissions")
                      .update({ id: p.id }, { enabled: true })
                    }
    })
  );
};

async function isFirstRun() {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "setup"
  });
  const initHasRun = await pluginStore.get({ key: "initHasRun" });
  await pluginStore.set({ key: "initHasRun", value: true });
  return !initHasRun;
};


async function bootstrap_admin() {
  const params = {
    username: process.env.ADMIN_USER || 'admin',
    password: process.env.ADMIN_PASS || 'admin',
    firstname: process.env.ADMIN_USER || 'Admin',
    lastname: process.env.ADMIN_USER || 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.test',
    blocked: false,
    isActive: true,
  };
  //Check if any account exists.
  const admins = await strapi.query('user', 'admin').find();

  try {
    let tempPass = params.password;
    let verifyRole = await strapi.query('role', 'admin').findOne({ code: 'strapi-super-admin' });
    if (!verifyRole) {
      verifyRole = await strapi.query('role', 'admin').create({
        name: 'Super Admin',
        code: 'strapi-super-admin',
        description: 'Super Admins can access and manage all features and settings.',
      });
    }
    params.roles = [verifyRole.id];
    params.password = await strapi.admin.services.auth.hashPassword(params.password);
    await strapi.query('user', 'admin').create({
      ...params,
    });
    strapi.log.info('Admin account was successfully created.');
    strapi.log.info(`Email: ${params.email}`);
    strapi.log.info(`Password: ${tempPass}`);
  } catch (error) {
    strapi.log.error(`Couldn't create Admin account during bootstrap: `, error);
  }
}


async function get_roles() {
  const role_orm = strapi.plugins['users-permissions'].queries('role', 'users-permissions')

  const role_list = await role_orm.find({}, [])

  const roles = {}

  for (let role of role_list) {
    roles[ role._id ] = role
    roles[ role.name ] = role
  }

  return roles
}

async function get_permissions( selected_role, selected_type, selected_controller ) {
  const roles          = await get_roles()
  const permission_orm = strapi.plugins['users-permissions'].queries('permission', 'users-permissions')

  let permission_list  = await permission_orm.find({_limit: 999}, [])

  if ( selected_role       ) permission_list = permission_list.filter( ({ role       }) => `${role}`       === `${roles[selected_role]._id}` )
  if ( selected_type       ) permission_list = permission_list.filter( ({ type       }) => `${type}`       === `${selected_type}`            )
  if ( selected_controller ) permission_list = permission_list.filter( ({ controller }) => `${controller}` === `${selected_controller}`      )

  return permission_list
}

async function enable_permissions(role, type, controller, permissionsWhitelist) {
  strapi.log.info(`Setting '${controller}' permissions for '${role}'`)

  const permission_orm = strapi.plugins['users-permissions'].queries('permission', 'users-permissions')

  const permissions = await get_permissions(role, type, controller)
    console.log(permissions)

  for (let { _id } of permissions) {
    permission_orm.update({ _id }, { enabled: true })
  }
}

// async function bootstrap_resource(resource_type, resource_service) {
//   strapi.log.info(`Bootstrapping ${resource_type}`)
//
//   const resources = XLSX.utils.sheet_to_json(BOOTSTRAP_DATA[resource_type])
//
//   for (let resource of resources) {
//
//     if (await resource_service.count(resource) === 0) {
//       strapi.log.warn(`Bootstrapping ${resource_type}: ${JSON.stringify(resource)}`)
//
//       await resource_service.create(resource)
//     }
//   }
// }

module.exports = async () => {

  // enable_permissions('Public', 'application', 'movie', ['findone', 'find']     )
  const basePath = `${__dirname}/../../seeds/movie`
  const files = await fs.promises.readdir(path.normalize(basePath));
  let entity
  for( const file of files ) {
    entity = await fs.readJson(`${basePath}/${file}`)
    try {
      await strapi.services.movie.create(entity)
    } catch(err) {}
  }

  const firstRun = await isFirstRun();

  if (firstRun && process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') {

    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'prosperamdb-omdb',
    })
    await pluginStore.set({ key: 'apiKey', value: process.env.OMDB_API_KEY })

    await bootstrap_admin()
    await setDefaultPublicPermissions('movie', ['findone', 'find'])
  }
}
