#!/bin/bash

#########
# CONFIG
#########
git config --global push.default current
git config --global credential.helper 'cache --timeout=3600'


#########
# ALIAS
#########

# amend
git config --global alias.amend 'commit -a --amend'

# co : checkout
git config --global alias.co 'checkout'

# cob : checkout with branch creation if not exist
git config --global alias.cob 'checkout -b'

# s : short status
git config --global alias.s 'status -sb'

# l : beautiful log
git config --global alias.l 'log --graph --pretty=format:"%C(yellow)%h%C(cyan)%d%Creset %s %C(white)- %an, %ar%Creset"' 

# ls: log with commited files
git config --global alias.ls 'log --pretty=format:"%C(yellow)%h%C(cyan)%d%C(green) %s %C(white)- %an, %ar%Creset" --decorate --numstat'

# d: git diff with word colors
git config --global alias.d 'diff --color-words'

# wip : quick save in progress commit
git config --global alias.wip '!git add . && git commit -m "WIP"' 

# cm : quick commit
git config --global alias.cm '!git add . && git commit -m '

# undo : save a commit point and undo last change
git config --global alias.undo '!git add -A && git commit -qm "UNDO SAVEPOINT" && git reset HEAD~1 --hard' 

# bclean : used by bdone
git config --global alias.bclean '!f() { git branch --merged ${1-master} | grep -v " ${1-master}$" | xargs -r git branch -d; }; f'

# bdone : chekout master and clean the merged branches
git config --global alias.bdone '!f() { git checkout ${1-master} && git sync && git bclean ${1-master}; }; f'

# la : list of aliases
git config --global alias.la '!git config -l | grep alias | cut -c 7-' 

# b : list the local branches
git config --global alias.b '!git for-each-ref --sort="-authordate" --format="%(authordate)%09%(objectname:short)%09%(refname)" refs/heads | sed -e "s-refs/heads/--"'

# ready : rebase interactive
git config --global alias.ready 'rebase -i master'

# ready-root : rebase interactive including the root commit
git config --global alias.ready-root 'rebase -i --root'

# sync : sync master
git config --global alias.sync '!git pull --rebase --prune $@ && git submodule update --init --recursive'

# Add a remote upstream
git config --global alias.upstream '!f() { git remote add upstream https://github.com/$1.git; }; f'

# Sync upstream
git config --global alias.syncu '!f() { git checkout ${1-master} && git fetch upstream && git rebase upstream/master; }; f'

# See object
git config --global alias.type 'cat-file -t'
git config --global alias.dump 'cat-file -p'

# Push version
git config --global alias.pv '!git push --tag && git push'

# Remote
git config --global alias.r 'remote -v'


#########
# hooks
#########
directory=$(dirname $(readlink -f $0))
ln $directory/validate-commit-msg.js $directory/../.git/hooks/commit-msg