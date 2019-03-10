<?php
/**
 * Created by PhpStorm.
 * User: HULANG-BTB
 * Date: 2019/2/21
 * Time: 23:57
 */

namespace app\backend\controller;

use think\Controller;
use think\Request;
use think\Config;
use think\Loader;
use think\Exception;
use think\Db;
use think\Validate;

class Article extends Controller
{

    public function index(){
        $page = $this->request->param("page", 1);
        $articles = Db::name("articles")
            ->where(['status' => 0])
            ->page($page, 15)
            ->select();

        $pages = Db::name('articles')
            ->count();
        $pages = $pages / 15;

        $this->assign("articles", $articles);
        $this->assign('pages', $pages);

        return $this->view->fetch();

    }

    public function add(){
        $tags = Db::name("tags")
            ->select();
        $this->assign("tags", $tags);
        $categorys = Db::name("category")
            ->select();
        $this->assign("categorys", $categorys);
        return $this->view->fetch();
    }

    public function insert() {
        $ret = [
            'status' => 0,
            'msg' => null,
        ];
        $title = $this->request->param('title');
        $abstract = $this->request->param('abstract');
        $content = $this->request->param('content');
        $tags = implode("|", $this->request->param('tags/a'));
        $category = $this->request->param('category/d');
        $thumbnail = "";
        if ( strlen($abstract) == 0 ) {
            $abstract = substr($content,0, min(510, strlen($content)));
        }
        $upload = new \org\Upload();
        $upload->exts = ['jpg','gif','png','jpeg'];
        $upload->rootPath = './uploads/Images/thumbnail/';
        $info = $upload->uploadOne($_FILES['thumbnail']);

        if ($info) {
            $thumbnail = "/uploads/Images/thumbnail/" . $info['savepath'] . $info['savename'];
        } else {
            $thumbnail = "/uploads/Images/thumbnail/default.png";
        }


        $data = [
            'title' => $title,
            'abstract' => $abstract,
            'content'=> $content,
            'tags_list' => $tags,
            'thumbnail' => $thumbnail,
            'category_id' => $category,
        ];

        $result = Db::name('articles')->insert($data);

        if ($result) {
            $ret['status'] = 1;
        } else {
            $ret['msg'] = "新增文章失败！";
        }
        return json($ret);
    }

    public function delete() {
        $id = $this->request->param('id/d|0');
        $ret = [
            'status' => 0,
            'msg' => null,
        ];
        $rst = Db::name('articles')->delete($id);
        if ($rst === false) {
            $ret['msg'] = '删除失败';
        } else {
            $ret['status'] = 1;
        }
        return json($ret);
    }

    public function picture() {

        $ret = [
            'success' => 0,
            'message' => null,
            'url' => null,
        ];

        $upload = new \org\Upload();
        $upload->exts = ['jpg','gif','png','jpeg'];
        $upload->rootPath = './uploads/Images/article/';
        $info = $upload->uploadOne($_FILES['editormd-image-file']);
        $thumbnail = "/uploads/Images/article/" . $info['savepath'] . $info['savename'];
        if ($info) {
            $ret['success'] = 1;
            $ret['url'] = $thumbnail;
            $ret['message'] = "上传图片成功！";
        } else {
            $ret['message'] = $upload->getError();
        }
        return json($ret);
    }

    public function edit() {
        $id = $this->request->param('id/d', 0);
        if ($id == 0)
        {
            return $this->error('非法操作！');
        }
        $article = Db::name('articles')
            ->where(['id' => $id])
            ->find();
        if (!$article)
        {
            return $this->error('非法操作！');
        }
        $this->assign('article', $article);
        $tags = Db::name("tags")
            ->select();
        $this->assign("tags", $tags);
        $categorys = Db::name("category")
            ->select();
        $this->assign("categorys", $categorys);

        $thisTags = explode("|", $article['tags_list']);
        $thisCategory = $article['category_id'];
        $this->assign("thisTags", $thisTags);
        $this->assign("thisCategory", $thisCategory);
        return $this->fetch();

    }

    public function update() {
        $ret = [
            'status' => 0,
            'msg' => null,
        ];
        $id = $this->request->param('id');
        $title = $this->request->param('title');
        $abstract = $this->request->param('abstract');
        $content = $this->request->param('content');
        $tags = implode("|", $this->request->param('tags/a'));
        $category = $this->request->param('category/d');
        if ( strlen($abstract) == 0 ) {
            $abstract = substr($content,0, min(510, strlen($content)));
        }
        $upload = new \org\Upload();
        $upload->exts = ['jpg','gif','png','jpeg'];
        $upload->rootPath = './uploads/Images/thumbnail/';
        $info = $upload->uploadOne($_FILES['thumbnail']);

        $data = [
            'id' => $id,
            'title' => $title,
            'abstract' => $abstract,
            'content'=> $content,
            'tags_list' => $tags,
            'category_id' => $category,
        ];

        if ($info) {
            $data['thumbnail'] = "/uploads/Images/thumbnail/" . $info['savepath'] . $info['savename'];
        }

        $result = Db::name('articles')->update($data);

        if ($result) {
            $ret['status'] = 1;
        } else {
            $ret['msg'] = "更新文章失败！";
        }
        return json($ret);
    }

}