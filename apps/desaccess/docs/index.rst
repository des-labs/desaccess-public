.. DESaccess documentation master file, created by
   sphinx-quickstart on Mon Nov  9 10:36:22 2020.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

DESaccess deployment documentation
=====================================

This documentation repository is intended for the DES Labs team members as a way to maintain version-controlled documentation about the DESaccess deployment and development.

.. toctree::
   :maxdepth: 2
   :caption: Contents:
   
   local_development


Updating the DESaccess JobHandler database
-----------------------------------------------

Each instance of DESaccess runs its own MySQL database. Updates to this database can be run manually using the following method. For example, you may want to enable or disable a webcron job::

   export APIPASSWD=p@55w0rd
   export KUBECONFIG=$DEPLOYMENT_PUBLIC/private/infrastructure/cluster-prod/.kube/config
   kubectl config use-context cluster-admin@cluster-prod
   export namespace=deslabs

   SQLCMD=" select * from cron \G"
   
   #SQLCMD=" UPDATE cron SET enabled = 0 WHERE name = 'refresh_database_table_cache' \G"

   kubectl exec -it -n "${namespace}" "$(kubectl get pod -n "${namespace}" --selector=app=desaccess-mysql -o jsonpath='{.items[0].metadata.name}')" -- \
      mysql -u des \
      --password="${APIPASSWD}" \
      --database=des \
      --execute="${SQLCMD}"