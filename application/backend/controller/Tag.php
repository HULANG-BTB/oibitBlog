<?php
/**
 * Created by PhpStorm.
 * User: HULANG-BTB
 * Date: 2019/2/20
 * Time: 10:29
 */

namespace app\backend\controller;

use think\Controller;
use think\Request;
use think\Config;
use think\Loader;
use think\Exception;
use think\Db;
use think\Validate;

class Tag extends Controller
{
    public function index(){
        $tags = Db::name("tags")
            ->select();
        $this->assign("tags", $tags);
        return $this->view->fetch();
    }

    public function add(){
        $ret = [
            'status' => 0,
            'msg' => null,
        ];
        $name = $this->request->param("name");
        $isExist = Db::name("tags")
            ->where(["name" => $name])
            ->count();
        if ( $isExist ) {
            $ret['msg'] = "标签已存在！";
            return json($ret);
        }
        $status = Db::name("tags")->insert(['name' => $name]);
        if ( $status ) {
            $ret['status'] = 1;
        } else {
            $ret['msg'] = "新增标签失败！";
        }
        return json($ret);
    }

    public function modify(){
        $ret = [
            'status' => 0,
            'msg' => null,
        ];
        $id = $this->request->param("id");
        $name = $this->request->param("name");
        $isExist = Db::name("tags")
            ->where(["name" => $name])
            ->count();
        if ( $isExist ) {
            $ret['msg'] = "标签已存在！";
            return json($ret);
        }
        $status = Db::name("tags")
            ->where(['id' => $id])
            ->update(['name' => $name]);

        if ( $status ) {
            $ret['status'] = 1;
        } else {
            $ret['msg'] = "修改标签失败！";
        }
        return json($ret);
    }
}