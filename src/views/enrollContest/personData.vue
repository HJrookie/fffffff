<template>
  <div class="all-data">
    <el-descriptions class="margin-top" :column="2" border title="报名信息">
      <el-descriptions-item>
        <template slot="label"> 赛事名称 </template>
        {{ allData.cName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 赛届名称 </template>
        {{ allData.period }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 赛项 </template>
        {{ allData.item }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 参赛身份 </template>
        <el-tag size="small">{{ allData.role }}</el-tag>
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 组别 </template>
        <el-tag size="small">{{ allData.group }}</el-tag>
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 赛制 </template>
        <el-tag size="small">{{ allData.rule }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <!--        -->
    <el-descriptions class="margin-top" :column="2" border title="个人信息" style="margin-top: 20px" labelClassName="label-width">
      <el-descriptions-item>
        <template slot="label"> 姓名 </template>
        {{ allData.hName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 性别 </template>
        {{ allData.sex }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 年龄 </template>
        {{ allData.age }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 民族 </template>
        {{ allData.nation }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 手机号 </template>
        {{ allData.phone }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 邮箱 </template>
        {{ allData.email }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 身份证号 </template>
        {{ allData.idNumber }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 政治面貌 </template>
        {{ allData.zzmm }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 现从事职业 </template>
        {{ allData.job }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 职称 </template>
        {{ allData.jobLevel }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 所属单位 </template>
        {{ allData.institution }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 单位手机号 </template>
        {{ allData.institutionPhone }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 领队姓名 </template>
        {{ allData.leadName }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 领队手机号 </template>
        {{ allData.leadPhone }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 指导教师一 </template>
        {{ allData.academicAdvisorOne }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 指导教师二 </template>
        {{ allData.academicAdvisorTwo }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label"> 文化程度 </template>
        {{ allData.edu }}
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template slot="label"> 现有职业资格及等级 </template>
        {{ allData.jobZige }}
      </el-descriptions-item>

      <el-descriptions-item :span="2">
        <template slot="label"> 户籍所在地 </template>
        {{ allData.registeredResidence }}
      </el-descriptions-item>

      <el-descriptions-item :span="2">
        <template slot="label"> 个人简历 </template>
        {{ allData.history }}
      </el-descriptions-item>

      <slot name="extra"></slot>
    </el-descriptions>
  </div>
</template>

<script>
export default {
  //个人用户 参加赛项报名时的数据,
  props: {
    allData: {
      type: Object,
      default: {},
    },
  },
};
</script>

<style lang="scss" scoped>
.all-data {
  ::v-deep {
    img.avatar {
      max-height: 100px;
      max-width: 100px;
    }
    img.idCard {
      max-height: 100px;
      max-width: 100px;
    }
    .label-width {
      min-width: 80px;
      max-width: 240px;
    }
  }
}
</style>
