## Why

当前应用只支持记录一个宝宝的数据，但许多家庭有多个宝宝（如双胞胎、二胎等），用户需要能够切换不同宝宝的记录，分别管理每个宝宝的喂养、睡眠、换尿布等信息。

## What Changes

- 新增"宝宝管理"功能，支持添加、编辑、删除宝宝信息
- 在首页顶部添加宝宝切换器，快速切换当前查看/记录的宝宝
- 所有记录数据与特定宝宝关联，按宝宝筛选显示
- 统计数据按当前选中的宝宝进行汇总
- **BREAKING**: 数据库记录表需新增 babyId 字段关联宝宝

## Capabilities

### New Capabilities
- `baby-management`: 宝宝的增删改查管理，包括姓名、出生日期、性别、头像等信息
- `baby-switcher`: 宝宝切换器UI组件，支持快速切换当前宝宝
- `baby-data-isolation`: 宝宝数据隔离，确保记录、统计按宝宝区分

### Modified Capabilities
- `records`: 记录功能需要关联到特定宝宝，API 需支持按宝宝筛选

## Impact

- **Backend**: 新增 Baby 实体和模块，修改 Record 实体添加 babyId 关联
- **Frontend**: 新增宝宝管理页面、宝宝切换器组件，修改记录相关API调用
- **Database**: 新增 babies 表，records 表新增 baby_id 字段
- **API**: 所有记录相关接口需增加 babyId 参数
