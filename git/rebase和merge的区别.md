# Git Rebase 和 Merge 的区别

Git 提供了两种整合分支的方法：`merge` 和 `rebase`。虽然两者都用于分支合并，但它们的工作方式和产生的结果有很大的不同。       

## 基本概念

### Merge（合并）
- 会创建一个新的合并提交
- 保留完整的分支历史
- 不会改变现有的提交历史

### Rebase（变基）
- 移动或者合并一系列提交到新的基础点
- 会改写提交历史
- 使提交历史更加整洁

## 工作方式对比

### Merge 的工作方式

```bash
# 在 master 分支上合并 feature 分支
git checkout master
git merge feature
```

合并后的结果：
```
     A---B---C (master)
    /         \
D---E---F---G---H (merge commit)
```

### Rebase 的工作方式

```bash
# 在 feature 分支上执行 rebase
git checkout feature
git rebase master
```

变基后的结果：
```
D---E---F---G (master)
                \
                 A'---B'---C' (feature)
```

## 主要区别

1. **提交历史**
   - Merge: 保留完整的提交历史
   - Rebase: 产生线性的提交历史

2. **冲突处理**
   ```bash
   # Merge 冲突处理
   git merge feature
   # 解决冲突
   git add .
   git commit -m "Merge feature branch"
   
   # Rebase 冲突处理
   git rebase master
   # 解决冲突
   git add .
   git rebase --continue
   ```

3. **使用场景**
   - Merge: 适合需要保留完整历史记录的场景
   - Rebase: 适合需要保持提交历史整洁的场景

## 使用建议

### 适合使用 Merge 的情况

1. 合并公共分支
```bash
# 合并主分支的更新
git checkout feature
git merge master
```

2. 团队协作的功能分支
```bash
# 合并团队成员的工作
git checkout main
git merge feature-team
```

### 适合使用 Rebase 的情况

1. 更新个人功能分支
```bash
# 更新个人分支
git checkout feature
git rebase master
```

2. 整理本地提交
```bash
# 交互式 rebase
git rebase -i HEAD~3
```

## 注意事项

1. **黄金法则**
```bash
# 永远不要在公共分支上使用 rebase
# 错误示例
git checkout master
git rebase feature  # 不要这样做！
```

2. **冲突处理**
```bash
# Rebase 过程中的冲突处理
git rebase master
# 如果发生冲突
git status  # 查看冲突文件
# 解决冲突后
git add .
git rebase --continue
# 如果想要放弃 rebase
git rebase --abort
```

3. **提交信息维护**
```bash
# 使用 rebase 修改提交信息
git rebase -i HEAD~3
# 将 pick 改为 reword 可以修改提交信息
```

## 最佳实践

1. **个人开发分支**
```bash
# 保持与主分支同步
git checkout feature
git rebase master
```

2. **团队协作分支**
```bash
# 合并团队成员的工作
git checkout master
git merge feature
```

3. **发布前整理提交**
```bash
# 整理提交历史
git checkout feature
git rebase -i master
```

## 总结

- Merge 适合：
  1. 需要保留完整历史记录
  2. 团队协作的公共分支
  3. 长期存在的特性分支

- Rebase 适合：
  1. 保持提交历史整洁
  2. 个人功能分支的同步
  3. 在提交推送到远程之前整理提交 