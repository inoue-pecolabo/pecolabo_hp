$(function() {
  // CSRFトークンの生成
  function generateCSRFToken() {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      var array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
      }).join('');
    } else {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
  }

  // CSRFトークンをセッションに保存（実際の実装ではサーバーサイドで行う）
  var csrfToken = generateCSRFToken();
  sessionStorage.setItem('csrf_token', csrfToken);

  // フォームバリデーションの改善
  $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function($form, event, errors) {
      console.log('Validation errors:', errors);
      showMessage('入力内容に誤りがあります。確認してください。', 'error');
    },
    submitSuccess: function($form, event) {
      event.preventDefault();
      
      // 入力値の取得と検証
      var name = $("input#name").val().trim();
      var email = $("input#email").val().trim();
      var phone = $("input#phone").val().trim();
      var message = $("textarea#message").val().trim();
      
      // クライアントサイドでの追加検証
      if (!validateForm(name, email, phone, message)) {
        return false;
      }
      
      var $submitButton = $("#sendMessageButton");
      var originalText = $submitButton.text();
      
      // ボタンの状態変更
      $submitButton.prop("disabled", true)
                  .html('<i class="fas fa-spinner fa-spin"></i> 送信中...');
      
      // 送信データの準備
      var formData = {
        name: name,
        phone: phone,
        email: email,
        message: message,
        csrf_token: csrfToken
      };
      
      $.ajax({
        url: "./mail/contact_me.php",
        type: "POST",
        data: formData,
        dataType: 'json',
        cache: false,
        timeout: 30000, // 30秒のタイムアウト
        success: function(response) {
          if (response.success) {
            showMessage('お問い合わせありがとうございます。内容を確認の上、担当者よりご連絡いたします。', 'success');
            $('#contactForm')[0].reset();
            // 新しいCSRFトークンを生成
            csrfToken = generateCSRFToken();
            sessionStorage.setItem('csrf_token', csrfToken);
          } else {
            showMessage(response.error || '送信に失敗しました。', 'error');
          }
        },
        error: function(xhr, status, error) {
          var errorMessage = '送信に失敗しました。';
          
          if (status === 'timeout') {
            errorMessage = '送信がタイムアウトしました。時間をおいて再度お試しください。';
          } else if (xhr.status === 429) {
            errorMessage = '送信回数が上限に達しました。しばらく時間をおいてから再度お試しください。';
          } else if (xhr.status === 403) {
            errorMessage = 'セキュリティエラーが発生しました。ページを再読み込みしてお試しください。';
          } else if (xhr.status >= 500) {
            errorMessage = 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。';
          }
          
          showMessage(errorMessage, 'error');
        },
        complete: function() {
          // ボタンの状態を元に戻す
          setTimeout(function() {
            $submitButton.prop("disabled", false).text(originalText);
          }, 1000);
        }
      });
    },
    filter: function() {
      return $(this).is(":visible");
    },
  });

  // フォーム検証関数
  function validateForm(name, email, phone, message) {
    var isValid = true;
    var errors = [];
    
    // 名前の検証
    if (name.length < 2) {
      errors.push('お名前は2文字以上で入力してください。');
      isValid = false;
    }
    
    // メールアドレスの検証
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('正しいメールアドレスを入力してください。');
      isValid = false;
    }
    
    // 電話番号の検証
    var phoneRegex = /^[\d\-\+\(\)\s]+$/;
    if (!phoneRegex.test(phone) || phone.length < 10) {
      errors.push('正しい電話番号を入力してください。');
      isValid = false;
    }
    
    // メッセージの検証
    if (message.length < 10) {
      errors.push('お問い合わせ内容は10文字以上で入力してください。');
      isValid = false;
    }
    
    if (!isValid) {
      showMessage(errors.join('<br>'), 'error');
    }
    
    return isValid;
  }
  
  // メッセージ表示関数
  function showMessage(message, type) {
    var alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    var icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    
    $('#success').html(
      '<div class="alert ' + alertClass + ' alert-dismissible fade show" role="alert">' +
      '<i class="fas ' + icon + '"></i> ' +
      '<span>' + message + '</span>' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
      '<span aria-hidden="true">&times;</span>' +
      '</button>' +
      '</div>'
    );
    
    // 成功メッセージの場合は自動で消す
    if (type === 'success') {
      setTimeout(function() {
        $('.alert').fadeOut();
      }, 5000);
    }
  }

  // タブクリックイベント
  $("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });
  
  // フォーカス時にメッセージをクリア
  $('#name, #email, #phone, #message').focus(function() {
    $('#success').html('');
  });
  
  // フォーム送信の防止（Enterキーでの送信）
  $('#contactForm').on('keypress', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      return false;
    }
  });
});
