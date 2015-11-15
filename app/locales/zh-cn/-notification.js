export default {
  'notification': {
    'jsonapi': '客户端数据出现错误',
    'username': '用户名长度要超过4个英文字母',
    'email': '邮箱地址不正确',
    'phone': '手机号码不正确',
    'password': {
      'length': '密码长度要超过8个英文字母',
      'rule': '密码要包括至少一个小写字母，一个大写字母，和一个数字'
    },
    'first_name': '请填入您的姓氏',

    // login page
    'login': {
      'pre_login_activation': '请去你的注册时使用的邮箱点击激活链接',
      'authenticate': '请填入正确的密码',
      'authenticateAll': '用户名或者密码不正确'
    },

    'signup': {
      'default': '用户注册失败，请联系管理员',
      'duplicate': {
        'username': '用户名已经使用过',
        'email': '邮箱已经使用过',
        'phone': '电话号码已经使用过',
        'username/email': '用户名和邮箱已经使用过',
        'username/email/phone': '用户名, 邮箱, 和电话号码都已经使用过',
        'username/phone': '用户名和电话号码已经使用过',
        'email/phone': '邮箱和电话号码已经使用过'
      },
      'db_error': '不能保存在数据库中',

      email: {
        'sent': '快行动吧，去你的邮箱点击激活链接'
      },

      'mobile': {
        'sent': '请将发送的验证码输入'
      }
    },

    // browser request, new user registration verification
    'activation': {
      'default': '用户激活失败，请联系管理员',
      'success': '好消息！您已经成为了我们的注册用户',
      'invalid': '用户激活码不正确',
      'invalidOrExpired': '用户激活码不正确或者已经过期了',
      'activated': '这个用户不存在或者用户已经成功激活了',

      // mobile request, new user registration verification
      'mobile': {
        'default': '用户信息或者验证码不正确',
        'length': '验证码长度至少4个数字',
        'numeric': '验证码必须由数字组成',
        'invalidOrExpired': '验证码不正确或者已经过期了'
      }
    },

    'reset_password': {
      'default': '更改密码失败，请联系管理员',
      'not_found': '您输入的用户不存在',
      'invalid': '无法识别用户名或者邮箱',
      'success': '更改密码的链接已经发送到您的邮箱了',
      'default_completeion': '更改密码失败，请联系管理员',
      'invalidOrExpired': '验证码不正确或者过期了，点击忘记密码重新开始',
      'code_invalid': '验证码不正确',

      'email': {
        'success': '成功更改了密码, 请使用新密码登录'
      },

      'mobile': {
        'new_password': '请输入手机短信的验证码和新的密码',
        'success': '成功更改了密码, 请使用新密码登录'
      }
    },

    'token_verification': {
      'invalidation': '登陆时间过长，请重新登录',
      'unauthorized': '您没有权限看到这个网页',
      'success_clear_token': '你已经成功的离开我们的应用, 请重新登录',
      'require_login': '必须要登陆才能看到这个网页'
    },

    'friends': {
      'checking_status': {
        'default': '查看朋友状态中遇到问题',
        'missing': '请求中没有用户名或者邮箱',
        'linked': '{{requester}}和您已经是朋友了'
      },

      'linking': {
        'default': '添加好友操作中遇到问题'
      }
    }
  }
};
