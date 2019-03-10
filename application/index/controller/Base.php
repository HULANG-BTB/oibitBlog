<?php
/**
 * Created by PhpStorm.
 * User: HULANG-BTB
 * Date: 2019/2/19
 * Time: 22:47
 */

namespace app\index\controller;

use think\Controller;
use think\Exception;
use think\Db;
use think\facade\Request;
use think\facade\Config;
use think\facade\Validate;

class Base extends Controller
{

    protected $webTitle = "";
    protected $webKeywords = "";
    protected $webDescription = "";

    public function initialize() {
        // 调用父类初始化方法
        parent::initialize();
        // 设置网页标题 并且绑定变量
        $this->webTitle = "Bit客栈";
        $this->assign('title', $this->webTitle);
        $this->assign('keyword', $this->webKeywords);
        $this->assign('description', $this->webDescription);
        // 获取网页导航栏 并且绑定变量
        $navBar = Db::name("navigations")
            ->where(["status" => 0])
            ->order(["sequence" => "ASC", "id" => "DESC"])
            ->select();
        $this->assign("navBar", $navBar);
    }

    public function index() {
        $navBar = Db::name("navigations")
            ->where(["status" => 0])
            ->order(["sequence" => "ASC", "id" => "DESC"])
            ->select();
        $this->assign("navBar", $navBar);
    }
}