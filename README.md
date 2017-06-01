# BookDen
## <br>_Setting up local repository_
#### 1) Go to the directory where you want to create the repository (The clone will come within a folder, so no need to create a folder), and type this:
```shell
$ git clone https://github.com/uzillion/BookDen.git
```
##### You will be prompted for username-password. Sign in.
#### 2) Enter the repository directory:
```shell
$ cd BookDen
```
#### 3) Check if everything is fine by typing this, and checking if output looks similar:
```shell
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
nothing to commit, working tree clean
```
#### 4) Automatically install all dependencies from package.json by typing:
```shell
$ npm install
```
#### Note: Always do `$ git pull origin` bofore starting work
## <br>_Commit changes to local respository_
```shell
$ git add .
```
##### Yes there is a dot after add
```shell
$ git commit -m "<message (what did you change?)>"
```
## <br>_Push changes to remote repository_
#### 1) Check if everything is committed:
```shell
$ git status
```
#### 2) If `$ git status` returns without any issues, type this:
```shell
$ git push -u origin
```
**Sign in will be required**
