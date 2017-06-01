# BookDen
## <br>_Setting up local repository_
#### 1) Create a "BookDen" directory in your desired location
#### 2) Go to the "BookDen/" directory through your terminal, and type these:
```shell
$ git clone https://github.com/uzillion/BookDen.git
```
#### 3) You will be prompted for username-password. Sign in, and type these:
```shell
$ git remote add origin https://github.com/uzillion/BookDen.git
```
```shell
$ git fetch origin
```
#### 4) Will be prompted for username-password again. Sign in, and type this:
```shell
$ git branch -u origin/master
```
#### 5) Check if everything is fine by typing this, and checking if output looks similar:
```shell
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
nothing to commit, working tree clean
```
#### Note: Always do `$ git pull origin` bofore starting work
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
