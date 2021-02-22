import {config, rbac_bindings} from '../components/des-config.js';
import { store } from '../store.js';

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_JOB_ID = 'UPDATE_JOB_ID';
export const UPDATE_ACTIVATION_TOKEN = 'UPDATE_ACTIVATION_TOKEN';
export const UPDATE_RESET_PASSWORD_TOKEN = 'UPDATE_RESET_PASSWORD_TOKEN';
export const UPDATE_RENEW_JOB_TOKEN = 'UPDATE_RENEW_JOB_TOKEN';
export const UPDATE_LAST_VALID_PAGE = 'UPDATE_LAST_VALID_PAGE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const UPDATE_DRAWER_PERSIST = 'UPDATE_DRAWER_PERSIST';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const UPDATE_QUERY = 'UPDATE_QUERY';
export const TRIGGER_HELP_FORM = 'TRIGGER_HELP_FORM';
export const UPDATE_USER_PREFERENCES = 'UPDATE_USER_PREFERENCES';

// TODO: double request to /profile
const isauth = () => {
  const token = localStorage.getItem("token");
  if (token === null){
    return false;
  }
  const Url=config.backEndUrl + "profile";
  const formData = new FormData();
  formData.append('token', token);
  const data = new URLSearchParams(formData);
  const param = { body:data, method: "POST"};
  return fetch(Url, param).then(resp => resp.json())
    .then(function(data){
      if (data.status=='ok') {
        localStorage.setItem("token", data.new_token);
        return true;
      }
      else {return false;}
    })
};

export const navigate = (path,persist,ap,session) => (dispatch) => {
  // Strip preceding and trailing slashes from root path and location.pathname
  // so that path and basePath are in general of the form `blah/blah` where only one slash
  // separates each word and there are no surrounding slashes
  let iterstr = null;
  let basePath = config.rootPath;
  while(basePath !== iterstr) {
    basePath = basePath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
    iterstr = basePath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
  }
  iterstr = null;
  while(path !== iterstr) {
    path = path.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
    iterstr = path.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
  }

  // discard the root path from the location.pathname so that pathnames like
  // `/desaccess/alpha/beta` become `alpha/beta`
  path = path.substring(path.search(basePath)+basePath.length).replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
  var targetPath = path;
  // pathParts should have no zero-length strings because of the slash reduction above
  var pathParts = path.split('/');
  var basePathParts = basePath.split('/');
  // is the session active, if not verify auth
  var page = pathParts[0];
  const auth = session ? true : isauth();
  if (auth === false && ['reset', 'activate', 'renew'].indexOf(page) === -1) {
    // dispatch(storeTargetPath(path));
    dispatch(loadPage('login', ap, targetPath));
    return;
  }
  switch (page) {
    case '':
    case 'login':
      page = 'home';
      targetPath = ''
      break;
    case 'status':
      // Highlight specific job in status if provided in URL {{location.origin}}/status/dkdh9s84ty3thj3wehg3
      if (pathParts.length > 1) {
        let jobId = pathParts[1];
        dispatch(setJobId(jobId));
      }
      break;
    case 'activate':
      // Get activation code from URL {{location.origin}}/activate/dkdh9s84ty3thj3wehg3
      if (pathParts.length > 1) {
        let activationToken = pathParts[1];
        dispatch(setActivationToken(activationToken));
      }
      break;
    case 'reset':
      // Get reset code from URL {{location.origin}}/reset/dkdh9s84ty3thj3wehg3
      if (pathParts.length > 1) {
        let resetPasswordToken = pathParts[1];
        dispatch(setResetPasswordToken(resetPasswordToken));
      }
      break;
    case 'renew':
      // Get job renewal code from URL {{location.origin}}/renew/dkdh9s84ty3thj3wehg3
      if (pathParts.length > 1) {
        let renewJobToken = pathParts[1];
        dispatch(setRenewJobToken(renewJobToken));
      }
      break;
    case 'help':
      // Highlight specific job in status if provided in URL {{location.origin}}/status/dkdh9s84ty3thj3wehg3
      if (pathParts.length > 1 && pathParts[1] === 'form') {
        dispatch(triggerHelpForm(true));
      }
      break;
    default:
      break;
  }

  dispatch(loadPage(page, ap, targetPath));
  persist ? '' : dispatch(updateDrawerState(false));
};

export const loadPage = (page,ap,targetPath = '') => (dispatch) => {
  switch(page) {
    case 'login':
      import('../components/des-pages/des-login.js').then((module) => {
        dispatch(updateDrawerState(false));
        dispatch(updateDrawerPersist(false));
        });
      break;
    case 'logout':
        localStorage.clear();
        dispatch(logoutUser());
        window.location.href = config.frontEndUrl + 'login';
      break;
    case 'home':
      ap.includes('home') ?   import('../components/des-pages/des-home.js') : import('../components/des-pages/des-access-denied.js') ;
      break;
    case 'test-job':
      ap.includes('test-job') ?   import('../components/des-pages/des-test-job.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'db-access':
      ap.includes('db-access') ?   import('../components/des-pages/des-db-access.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'tilefinder':
      ap.includes('tilefinder') ?   import('../components/des-pages/des-tilefinder.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'tables':
      ap.includes('tables') ?   import('../components/des-pages/des-tables.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'cutout':
      ap.includes('cutout') ?   import('../components/des-pages/des-cutout.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'status':
      ap.includes('status') ?   import('../components/des-pages/des-job-status.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'jupyter':
      ap.includes('jupyter') ?   import('../components/des-pages/des-jupyter.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'ticket':
      ap.includes('ticket') ?   import('../components/des-pages/des-ticket.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'users':
      ap.includes('users') ?   import('../components/des-pages/des-users.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'notifications':
      ap.includes('notifications') ?   import('../components/des-pages/des-notifications.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'activate':
      config.desaccessInterface === 'public' ? import('../components/des-pages/des-activate.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'reset':
      true ? import('../components/des-pages/des-reset.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'renew':
      true ? import('../components/des-pages/des-renew.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'help':
      ap.includes('help') ?   import('../components/des-pages/des-help.js') : import('../components/des-pages/des-access-denied.js') ;
      break;
    default:
      page = 'des404';
      import('../components/des-pages/des-404.js');
  }
  if (['login', 'des404'].indexOf(page) === -1) {
    dispatch(updateDrawerState(window.innerWidth >= 1001));
    dispatch(updateDrawerPersist(window.innerWidth >= 1001));
    dispatch(updateLastValidPage(page));
  }
  let newLocation = config.frontEndUrl + targetPath;
  let currentLocation = window.location.origin+window.location.pathname;
  if (newLocation !== currentLocation) {
    history.pushState({}, '', newLocation);
  }
  dispatch(updatePage(page));
};

const updateLastValidPage = (page) => {
  return {
    type: UPDATE_LAST_VALID_PAGE,
    page
  };
};

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
};

export const updateQuery = (query) => {
  return {
    type: UPDATE_QUERY,
    query
  };
};

export const setJobId = (jobId) => {
  return {
    type: UPDATE_JOB_ID,
    jobId
  };
};

export const setActivationToken = (activationToken) => {
  return {
    type: UPDATE_ACTIVATION_TOKEN,
    activationToken
  };
};

export const setResetPasswordToken = (resetPasswordToken) => {
  return {
    type: UPDATE_RESET_PASSWORD_TOKEN,
    resetPasswordToken
  };
};

export const setRenewJobToken = (renewJobToken) => {
  return {
    type: UPDATE_RENEW_JOB_TOKEN,
    renewJobToken
  };
};

export const updateUserPreferences = (preferences) => {
  return {
    type: UPDATE_USER_PREFERENCES,
    preferences
  };
};

export const triggerHelpForm = (arm) => {
  return {
    type: TRIGGER_HELP_FORM,
    arm
  };
};

export const updateDrawerState = (opened) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  };
};

export const updateDrawerPersist = (persisted) => {
  return {
    type: UPDATE_DRAWER_PERSIST,
    persisted
  };
};

export const loginUser = (userObj) => {
  return {
    type: LOGIN_USER,
    username: userObj.username,
    email: userObj.email,
    name: userObj.name,
    db: userObj.db,
    lastname: userObj.lastname,
    session: userObj.session,
    roles: userObj.roles,
    accessPages: getAccessPages(userObj.roles),
    preferences: userObj.preferences
  };
};

export const logoutUser = () => {
  return {
    type: LOGOUT_USER,
  };
};

export const getProfile = () => {
  return dispatch => {
      const token = localStorage.getItem("token");
      if (token) {
        const Url=config.backEndUrl + "profile";
        const formData = new FormData();
        formData.append('token', token);
        const data = new URLSearchParams(formData);
        const param = {
          body:data,
          method: "POST",
          headers: {'Authorization': 'Bearer ' + token}
        };
        return fetch(Url, param).then(resp => resp.json())
          .then(data => {
            if (data.status == 'ok') {
              dispatch(loginUser({
                "name": data.name, 
                "username":data.username, 
                "lastname": data.lastname, 
                "email": data.email,
                "session": true, 
                "db": data.db, 
                "roles": data.roles, 
                "preferences": data.preferences
              }));
              localStorage.setItem("token", data.new_token);
              return true;
            }
            else {
              dispatch(loadPage('logout', ''));
              return false;
            }
          });
      }

  }

};

export const getAccessPages = (roles) => {
  var ap = [];
  // roles.push('default');
  for (var i=0; i < rbac_bindings.length; i++) {
    if (roles.indexOf(rbac_bindings[i]["role_name"]) !== -1) {
      var pages = rbac_bindings[i]["pages"]
      for (var j=0; j < pages.length; j++) {
        var page = pages[j];
        if (ap.indexOf(page) === -1) {
          ap.push(page);
        }
      }
    }
  }
  return ap
};
