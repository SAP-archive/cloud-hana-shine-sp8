![](https://img.shields.io/badge/STATUS-NOT%20CURRENTLY%20MAINTAINED-red.svg?longCache=true&style=flat)

# Important Notice
This public repository is read-only and no longer maintained. For the latest sample code repositories, visit the [SAP Samples](https://github.com/SAP-samples) organization.

#cloud-hana-shine

 #cloud-hana-sample=shinesp8

## Importing the "SHINE" source code to a Trial SAP HANA Instance with Eclipse
*Authors: Arun Rajamani, Dobromir Zahariev, Stephan Weber, Sangeetha Jayakumar*

SAP HANA Interactive Education, or SHINE, is a demo application that makes it easy to learn how to build native SAP HANA applications. The demo application, comes complete with sample data and design-time developer objects for the application's database tables, data views, stored procedures, OData, and user interface.

This repository contains SHINE SP8 that can be used with HANA SP8 or later.

### Requirements

- You have an Eclipse IDE with HANA Tools installed. A detailed description can be found at [Setting Up the Tools](https://help.hana.ondemand.com/help/frameset.htm?b0e351ada628458cb8906f55bcac4755.html).
- You have [created a Trial SAP HANA Instance](https://help.hana.ondemand.com/help/frameset.htm?1a597a4505fc4178acf2232ee0fda081.html), e.g. with the name `myhanaxs`.

## Add HANA System

In the `SAP HANA Development` perspective go to `Systems` tab, right click and choose `Add cloud System`. A detailed description can be found at [Connecting to a Productive SAP HANA Instance via the Eclipse IDE](https://help.hana.ondemand.com/help/frameset.htm?4efc124a0ccc42b3b502ad3a3908d23d.html).
This SHINE application is SP08 version. It will be imported in the specified SAP HANA schema and Repository package.

## Create a package
Create a package with name <kbd>shine</kbd>. A detailed description can found be at **TODO**

## Add HANA repository workspace
In the `SAP HANA Development` perspective go to `Repositories` tab, right click and choose `Create repository workspace`.

- Enter <kbd>cloud-hana-shine</kbd> as workspace name.
- Enter <kbd>C:\hanaxsws</kbd> as workspace root.
- Click `Finish` button.

The final workspace location is `C:\hanaxsws\cloud-hana-shine`.

## Check Out the Project
    Warning: The `p1940xxtrial` account we use in the following is just an example of a
    name of the trial account. You need to replace it with your actual trial account name.
    In addition, replace `p1940xx` with your actual SAP HANA Cloud Platform user.

- In the `Repositories` tab, expand your repository workspace e.g. `p1940xxtrial` and right click on it.
- Click `Check Out`.

- Now you have a local folder like `C:\hanaxsws\cloud-hana-shine\p1940xxtrial\myhanaxs\shine`

## Get the example code
- Download [https://github.com/SAP/cloud-hana-shine/archive/master.zip](https://github.com/SAP/cloud-hana-shine/archive/master.zip).

- The zip file contains a subfolder `cloud-hana-shine-master/shine`. Extract its content to the folder `C:\hanaxsws\cloud-hana-shine\p1940xxtrial\myhanaxs\shine` we created in the last step.

## Import the sample project
- In the `SAP HANA Development` perspective go to `Project Explorer` tab, right click and choose `Import->Import->General->Existing Projects into Workspace`.
Select root directory by browsing for the folder, e.g. `C:\hanaxsws\cloud-hana-shine\p1940xxtrial\myhanaxs\shine`.
- Click `Finish` button.
The project is listed in the Project Explorer.

- Right click on the project name and rename the project name from `{{PROJECT_NAME}}` to `shine`. 

- change `model_access.hdbrole` file content from

        role {{PACKAGE_NAME}}::model_access {
            application privilege: {{PACKAGE_NAME}}::Basic;
        }
    e.g. to

        role p1940xxtrial.myhanaxs.shine::model_access {
            application privilege: p1940xxtrial.myhanaxs.shine::Basic;
        }


### 7. Share the project
- Right click on the `shine` project and choose `Team->Share Project-SAP HANA Repository`.
- Click `Next` and then `Finish` button.

### 8. Activate
- Right click on the `shine` project and choose `Team->Activate`.

### 9. Run
- Log onto the [cockpit on the trial landscape](https://account.hanatrial.ondemand.com/cockpit) and choose `HANA XS Applications`.
- In the HANA XS Applications table, click the `application URL` link to launch the application.

A detailed description can be found at [Launching SAP HANA XS Applications](https://help.hana.ondemand.com/help/frameset.htm?0dd61c3e5d1d4d6cbea9aec94b7f4725.html).


## TODO
Add a link to the Step by step guide for the Web IDE scenario.
