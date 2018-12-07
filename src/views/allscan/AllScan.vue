<template>
    <div>
        <span>总览</span>
        <div class="content">
            <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose">
        <el-submenu index="1">
            <template slot="title">
            <i class="el-icon-location"></i>
            <span>导航一</span>
            </template>
            <el-menu-item index="1-1" ><router-link to='/one'>选项1</router-link></el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
            <el-menu-item index="1-3">选项3</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" route="/two">
            <i class="el-icon-menu"></i>
            <span slot="title"><router-link to='/two'>导航二</router-link></span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
        </el-menu-item>
        </el-menu>
        <router-view></router-view>
        </div>
    </div>
</template>
