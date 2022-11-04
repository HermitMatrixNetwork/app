const languages = {
  CN: {
    Mywallet: '我的钱包',
    Totalassets: '总资产',
    send: '发送',
    receive: '接收',
    delegate: '委托',
    trading: '交易',
    searchPlaceholder: '输入合约地址查询',
    homeAssets: '首页资产管理',
    Collectionaddress: '收款地址',
    Sendamount: '发送金额',
    Minersfee: '矿工费',
    Customdefinition: '自定义',
    Transferconfirmation: '转账确认',
    Sendaccount: '发送账户',
    Receivingaccount: '接收账户',
    Transferamount: '转账金额',
    confirm: '确认',
    Slow: '慢',
    fast: '快',
    Recommend: '推荐',
    Available: '可用',
    Passwordconfirmation: '密码确认',
    'completeBackupToVerify': '完成备份，点击验证',
    'addressErrorTip': '收款地址不能为空',

    'text01': '资产',
    'text02': '总资产',
    'text03': '发送',
    'text04': '接收',
    'text05': '委托',
    'text06': '交易',
    'text07': '代币',
    'text08': '当前viewkey与链上不一致，代币余额和交易记录将无法获取，请进入代币详情页点击设置viewkey。',
    'text09': '确认',
    'text10': '切换钱包',
    'text11': '添加钱包（按钮）',
    'text12': '创建钱包',
    'text13': '导入钱包',
    'text14': '取消',
    'text15': '发送',
    'text16': '收款地址',
    'text17': '输入或粘贴钱包地址',
    'text18': '发送金额',
    'text19': '请输入金额',
    'text20': '钱包余额',
    'text21': '全部',
    'text22': '矿工费',
    'text23': '快',
    'text24': '推荐',
    'text25': '慢',
    'text26': '分钟',
    'text27': '自定义',
    'text28': '地址错误，请输入正确的收款地址！',
    'text29': '暂无地址，点击添加',
    'text30': '扫一扫',
    'text31': '相册',
    'text32': '扫描二维码，发起转账',
    'text33': '代币选择',
    'text34': 'Gas Price过低，将影响交易确认时间',
    'text35': 'Gas过低，请输入有效的Gas',
    'text36': '确认',
    'text37': '交易发起成功！',
    'text38': '网络错误！',
    'text39': '当前转账额度达到所设置的交易提示额度，为高额转账，请确认本次转账是安全的，才可继续完成转账操作。',
    'text40': '取消',
    'text41': '确认',
    'text42': '转账确认',
    'text43': '发送账户',
    'text44': '转账账户',
    'text45': '转账金额',
    'text46': '矿工费',
    'text47': '确认',
    'text48': '资金密码',
    'text49': '请输入资金密码',
    'text50': '确认',
    'text51': '资金密码错误，请重新输入!',
    'text52': '该地址仅支持 Hermit Matrix Network 资产，请勿转入其他公链资产',
    'text53': '扫二维码，转入 Hermit Matrix Network 资产',
    'text54': '钱包地址',
    'text55': '点击复制',
    'text56': '复制成功！',
    'text57': '可用',
    'text58': '锁定',
    'text59': '发送',
    'text60': '接收',
    'text61': '交易',
    'text62': '委托',
    'text63': '全部',
    'text64': '发送',
    'text65': '收款',
    'text66': '委托',
    'text67': '领取',
    'text68': '失败',
    'text69': '详情',
    'text70': '接收',
    'text71': '扫二维码，转入 GHM',
    'text72': '钱包地址',
    'text73': '保存图片',
    'text74': '点击复制',
    'text75': '复制成功！',
    'text76': '基本信息',
    'text77': '项目简称',
    'text78': '项目全称',
    'text79': '官网',
    'text80': '合约地址',
    'text81': '发行信息',
    'text82': '交易详情',
    'text83': '交易状态：成功、失败、调用合约失败',
    'text84': '金额',
    'text85': '矿工费',
    'text86': '收款地址',
    'text87': '付款地址',
    'text88': '交易号',
    'text89': '委托金额',
    'text90': '委托人',
    'text91': '被委托验证人',
    'text92': '领取金额',
    'text93': '操作账户',
    'text94': '领取接收地址',
    'text95': '发送',
    'text96': '接收',
    'text97': '交易',
    'text98': '查看/设置',
    'text99': '详情',
    'text100': '交易类型：全部、发送、收款、失败',
    'text101': '查看viewkey',
    'text102': '复制viewkey',
    'text103': '复制成功！',
    'text104': '设置 viewkey',
    'text105': '执行合约',
    'text106': '请输入Memo （选填）',
    'text107': '确认',
    'text108': '交易确认',
    'text109': '执行合约',
    'text110': '详情',
    'text111': '矿工费',
    'text112': '确认',
    'text113': '暂无记录',
    'text114': '当前没有viewkey或本地viewkey与链上不一致，无法获取记录，请先设置！',
    'text115': '管理',
    'text116': '钱包地址',
    'text117': '钱包名称',
    'text118': '重置钱包密码',
    'text119': '导出助记词',
    'text120': '导出私钥',
    'text121': '导出Keystore',
    'text122': '移除',
    'text123': '修改名称',
    'text124': '请输入新名称，不超过10个字符',
    'text125': '取消',
    'text126': '确认',
    'text127': '钱包名称修改成功！',
    'text128': '报错提示：名称超过10个字符，请重新输入！',
    'text129': '钱包密码',
    'text130': '请输入钱包密码',
    'text131': '取消',
    'text132': '确认',
    'text133': '报错提示：钱包密码错误，请确认后重新输入！',
    'text134': '安全提示',
    'text135': '请勿截图',
    'text136': '备份提示',
    'text137': '请离线保存，勿保存至邮箱、聊天应用等在线工具，存在泄漏风险',
    'text138': '请勿通过网络工具传输，如被获取将可能被盗取账户资产，且无法找回',
    'text139': '请勿向任何人透漏或分享私钥，掌握私钥将获得资产所有权',
    'text140': 'Keystore',
    'text141': '提示：复制成功！',
    'text142': '验证助记词',
    'text143': '请根据已备份好的助记词按顺序选择',
    'text144': '确认',
    'text145': '提示：备份成功！',
    'text146': '重置密码',
    'text147': '原钱包密码验证',
    'text148': '输入原钱包密码',
    'text149': '下一步',
    'text150': '资金密码错误，请重新输入！',
    'text151': '设置新密码',
    'text152': '下一步',
    'text153': '设置新密码',
    'text154': '再次输入新密码确认',
    'text155': '确认（按钮）',
    'text156': '再次输入新密码与首次输入不一致，请确认！',
    'text157': '新密码不能与原密码一致！',
    'text158': '钱包密码修改成功！',
    'text159': '移除提示',
    'text160': '钱包移除后将无法恢复，请务必先完成备份再操作，否则资产丢失无法找回！',
    'text161': '取消',
    'text162': '确认',
    'text163': '钱包移除成功！',
    'text164': '首页资产管理',
    'text165': '輸入合約地址查詢',
    'text166': '热门资产',
    'text167': '提示：添加成功！',
    'text168': '支持所有 Hermit Matrix Network 代币',
    'text169': '请输入代币合约地址进行搜索',
    'text170': '取消',
    'text171': '提示：删减成功！',
    'text172': '提示',
    'text173': '矿工费设置',
    'text174': '接收账户',
    'text175': '钱包管理',
    'text176': '点击复制',
    'text177': '请勿向任何人透漏或分享keystore，掌握keystore将获得资产所有权',
    'text178': '请勿向任何人透漏或分享助记词，掌握助记词将获得资产所有权',
    text179: '助记词错误提示：助记词错误，请检查！',
    text180: '暂未开放',
    text181: '成功',
    text182: '失败',
    text183: '我的钱包',
    text184: '执行中',
    text185: '执行成功',
    text186: '执行失败',
    text187: '尝试次数过多。请切换验证方式',
    text188: '收款地址不能为空',
    text189: '获得Keystore等于拥有钱包资产所有权',
    text190: '获得私钥等于拥有钱包资产所有权',
    text191: '获得助记词等于拥有钱包资产所有权',
    text192: '代币选择',
    text193: '可用',
    text194: '输入金额超过钱包可用余额，请重新输入',
    text195: '转账金额不能为空',
    text196: '指纹验证',
    text197: '切换验证方式',
    text198: '交易中',
    text199: '钱包地址不能为空',
    text200: '钱包名字不能为空',
    text201: '验证指纹中',
    text202: '验证成功',
    text203: '验证失败',
    text204: '尝试失败次数过多，请稍后再试',
    text205: '请输入Viewkey',
    text206: '点击加载更多',
    text207: '加载中',
    text208: '已全部加载完毕',
    text209: '当前',
    text210: 'viewkey 不能为空！',
    text211: '提示：钱包移除成功！',
    text212: '暂无热门代币',
    text213: '助记词',
    text214: '保存分享',
    text215: '请勿截屏分享和存储，这将可能被第三方恶意软件收集，造成资产损失。',
    text216: '取消委托金额',
    text217: '被取消验证人',
    text218: '完成备份，点击验证',
    text219: '当前转账额度达到所设置的交易提示额度，为高额转账，请确认本次转账是安全的，才可继续完成转账操作。',
    text220: '输入地址有误，请检查后重新输入',
    text221: '钱包密码不能少于8位',
    text222: '二维码生成中',
    text223: '图片已保存',
    text224: '明文私钥',
    text225: 'Keystore',
    text226: '不可转账给自己',
    text227: '已全部加载完毕',
    text228: 'Gas过低，请输入有效GAS',
    text229: '注：Gas Limit的估值受金额、地址及Memo的影响，请先完成信息的填写，才可以获取该估值；',
    text230: '点击复制',
    text231: '切换钱包中',
    text232: '切换钱包成功',
    text233: '发送失败',
    text234: '取消委托失败',
    text235: '初始化合约失败',
    text236: '调用合约失败',
    text237: '油费不足',
    text238: '地址有误',
    text239: '区块高度',
    text240: '自动领取奖励',
    text241: '自定义代币',
    text242: '添加代币',
    text243: '代币列表',
    text244: '代币合约',
    text245: '请输入代币合约地址',
    text246: '代币符号',
    text247: '请输入代币符号',
    text248: '代币精度',
    text249: '保存',
    text250: '未查询到合约信息，请检查合约地址是否正确！',
    text251: '删减成功！',
    text252: '请完成代币信息填写！',
    text253: '已存在该代币，请勿重复添加',
    text254: '添加代币成功！',
    text255: '暂无代币',
    text256: '未查询到合约信息，请检查合约地址是否正确！',
    text257: '删除'
  },
  CT: {
    Mywallet: '我的錢包 ',
    Totalassets: '總資產',
    send: '發送',
    receive: '接收',
    delegate: '委托',
    searchPlaceholder: '交易',
    searchPlaceholder: '輸入合約地址查詢',
    homeAssets: '首頁資產管理',
    Collectionaddress: '收款地址',
    Sendamount: '發送金額',
    Minersfee: '礦工費',
    Customdefinition: '自定義',
    Transferconfirmation: '轉賬確認',
    Sendaccount: '發送賬戶',
    Receivingaccount: '接收賬戶',
    Transferamount: '轉賬金額',
    confirm: '確認',
    Slow: '慢',
    fast: '快',
    Recommend: '推薦',
    Available: '可用',
    Passwordconfirmation: '密碼確認',
    'text01': '資產',
    'text02': '總資產',
    'text03': '發送',
    'text04': '接收',
    'text05': '委托',
    'text06': '交易',
    'text07': '代幣',
    'text08': '當前viewkey與鏈上不一致，代幣余額和交易記錄將無法獲取，請進入代幣詳情頁點擊設置viewkey。',
    'text09': '確認',
    'text10': '切換錢包',
    'text11': '添加錢包',
    'text12': '創建錢包',
    'text13': '導入錢包',
    'text14': '取消',
    'text15': '發送',
    'text16': '收款地址',
    'text17': '輸入或粘貼錢包地址',
    'text18': '發送金額',
    'text19': '請輸入金額',
    'text20': '錢包余額',
    'text21': '全部',
    'text22': '礦工費',
    'text23': '快',
    'text24': '推薦',
    'text25': '慢',
    'text26': '分鐘',
    'text27': '自定義',
    'text28': '地址錯誤，請輸入正確的收款地址！',
    'text29': '暫無地址，點擊添加',
    'text30': '掃一掃',
    'text31': '相冊',
    'text32': '掃描二維碼，發起轉賬',
    'text33': '代幣選擇',
    'text34': 'Gas Price過低，將影響交易確認時間',
    'text35': 'Gas過低，請輸入有效的Gas',
    'text36': '確認',
    'text37': '交易發起成功！',
    'text38': '網絡錯誤！',
    'text39': '當前轉賬額度達到所設置的交易提示額度，為高額轉賬，請確認本次轉賬是安全的，才可繼續完成轉賬操作。',
    'text40': '取消',
    'text41': '確認',
    'text42': '轉賬確認',
    'text43': '發送賬戶',
    'text44': '轉賬賬戶',
    'text45': '轉賬金額',
    'text46': '礦工費',
    'text47': '確認',
    'text48': '資金密碼',
    'text49': '請輸入資金密碼',
    'text50': '確認',
    'text51': '資金密碼錯誤，請重新輸入!',
    'text52': '該地址僅支持 Hermit Matrix Network 資產，請勿轉入其他公鏈資產',
    'text53': '掃二維碼，轉入 Hermit Matrix Network 資產',
    'text54': '錢包地址',
    'text55': '點擊復製',
    'text56': '復製成功！',
    'text57': '可用',
    'text58': '鎖定',
    'text59': '發送',
    'text60': '接收',
    'text61': '交易',
    'text62': '委托',
    'text63': '全部',
    'text64': '發送',
    'text65': '收款',
    'text66': '委托',
    'text67': '領取',
    'text68': '失敗',
    'text69': '詳情',
    'text70': '接收',
    'text71': '掃二維碼，轉入 GHM',
    'text72': '錢包地址',
    'text73': '保存圖片',
    'text74': '點擊復製',
    'text75': '復製成功！',
    'text76': '基本信息',
    'text77': '項目簡稱',
    'text78': '項目全稱',
    'text79': '官網',
    'text80': '合約地址',
    'text81': '發行信息',
    'text82': '交易詳情',
    'text83': '交易狀態：成功、失敗、調用合約失敗',
    'text84': '金額',
    'text85': '礦工費',
    'text86': '收款地址',
    'text87': '付款地址',
    'text88': '交易號',
    'text89': '委托金額',
    'text90': '委托人',
    'text91': '被委托驗證人',
    'text92': '領取金額',
    'text93': '操作賬戶',
    'text94': '領取接收地址',
    'text95': '發送',
    'text96': '接收',
    'text97': '交易',
    'text98': '查看/設置',
    'text99': '詳情',
    'text100': '交易類型：全部、發送、收款、失敗',
    'text101': '查看viewkey',
    'text102': '復製viewkey',
    'text103': '復製成功！',
    'text104': '設置 viewkey',
    'text105': '執行合約',
    'text106': '請輸入Memo （選填）',
    'text107': '確認',
    'text108': '交易確認',
    'text109': '執行合約',
    'text110': '詳情',
    'text111': '礦工費',
    'text112': '確認',
    'text113': '暫無記錄',
    'text114': '當前沒有viewkey或本地viewkey與鏈上不一致，無法獲取記錄，請先設置！',
    'text115': '管理',
    'text116': '錢包地址',
    'text117': '錢包名稱',
    'text118': '重置錢包密碼',
    'text119': '導出助記詞',
    'text120': '導出私鑰',
    'text121': '導出Keystore',
    'text122': '移除',
    'text123': '修改名稱',
    'text124': '請輸入新名稱，不超過10個字符',
    'text125': '取消',
    'text126': '確認',
    'text127': '錢包名稱修改成功！',
    'text128': '報錯提示：名稱超過10個字符，請重新輸入！',
    'text129': '錢包密碼',
    'text130': '請輸入錢包密碼',
    'text131': '取消',
    'text132': '確認',
    'text133': '報錯提示：錢包密碼錯誤，請確認後重新輸入！',
    'text134': '安全提示',
    'text135': '請勿截圖',
    'text136': '備份提示',
    'text137': '請離線保存，勿保存至郵箱、聊天應用等在線工具，存在泄漏風險',
    'text138': '請勿通過網絡工具傳輸，如被獲取將可能被盜取賬戶資產，且無法找回',
    'text139': '請勿向任何人透漏或分享私鑰，掌握私鑰將獲得資產所有權',
    'text140': 'Keystore',
    'text141': '提示：復製成功！',
    'text142': '驗證助記詞',
    'text143': '請根據已備份好的助記詞按順序選擇',
    'text144': '確認',
    'text145': '提示：備份成功！',
    'text146': '重置密碼',
    'text147': '原錢包密碼驗證',
    'text148': '輸入原錢包密碼',
    'text149': '下一步',
    'text150': '資金密碼錯誤，請重新輸入！',
    'text151': '設置新密碼',
    'text152': '下一步',
    'text153': '設置新密碼',
    'text154': '再次輸入新密碼確認',
    'text155': '確認（按鈕）',
    'text156': '再次輸入新密碼與首次輸入不一致，請確認！',
    'text157': '新密碼不能與原密碼一致！',
    'text158': '錢包密碼修改成功！',
    'text159': '移除提示',
    'text160': '錢包移除後將無法恢復，請務必先完成備份再操作，否則資產丟失無法找回！',
    'text161': '取消',
    'text162': '確認',
    'text163': '錢包移除成功！',
    'text164': '首頁資產管理',
    'text165': '輸入合約地址查詢',
    'text166': '熱門資產',
    'text167': '提示：添加成功！',
    'text168': '支持所有 Hermit Matrix Network 代幣',
    'text169': '請輸入代幣合約地址進行搜索',
    'text170': '取消',
    'text171': '提示：刪減成功！',
    'text172': '提示',
    'text173': '礦工費設置',
    'text174': '接收賬戶',
    'text175': '錢包管理',
    'text176': '點擊復製',
    'text177': '請勿向任何人透漏或分享keystore，掌握keystore將獲得資產所有權',
    'text178': '請勿向任何人透漏或分享助記詞，掌握助記詞將獲得資產所有權',
    text179: '助記詞錯誤提示：助記詞錯誤，請檢查！',
    text180: '暫未開放',
    text181: '成功',
    text182: '失敗',
    text183: '我的錢包',
    text184: '執行中',
    text185: '執行成功',
    text186: '執行失敗',
    text187: '嘗試次數過多。請切換驗證方式',
    text188: '收款地址不能為空',
    text189: '獲得Keystore等於擁有錢包資產所有權',
    text190: '獲得私鑰等於擁有錢包資產所有權',
    text191: '獲得助記詞等於擁有錢包資產所有權',
    text192: '代幣選擇',
    text193: '可用',
    text194: '輸入金額超過錢包可用余額，請重新輸入',
    text195: '轉賬金額不能為空',
    text196: '指紋驗證',
    text197: '切換驗證方式',
    text198: '交易中',
    text199: '錢包地址不能為空',
    text200: '錢包名字不能為空',
    text201: '驗證指紋中',
    text202: '驗證成功',
    text203: '驗證失敗',
    text204: '嘗試失敗次數過多，請稍後再試',
    text205: '請輸入Viewkey',
    text206: '點擊加載更多',
    text207: '加載中',
    text208: '已全部加載完畢',
    text209: '當前',
    text210: 'viewkey 不能為空！',
    text211: '提示：錢包移除成功！',
    text212: '暫無熱門代幣',
    text213: '助記詞',
    text214: '保存分享',
    text215: '請勿截屏分享和存儲，這將可能被第三方惡意軟件收集，造成資產損失。',
    text216: '取消委托金額',
    text217: '被取消驗證人',
    text218: '完成備份，點擊驗證',
    text219: '當前轉賬額度達到所設置的交易提示額度，為高額轉賬，請確認本次轉賬是安全的，才可繼續完成轉賬操作。',
    text220: '輸入地址有誤，請檢查後重新輸入',
    text221: '錢包密碼不能少於8位',
    text222: '二維碼生成中',
    text223: '圖片已保存',
    text224: '明文私鑰',
    text225: 'Keystore',
    text226: '不可轉賬給自己',
    text227: '已全部加載完畢',
    text228: 'Gas過低，請輸入有效GAS',
    text229: '註：Gas Limit的估值受金額、地址及Memo的影響，請先完成信息的填寫，才可以獲取該估值；',
    text230: '點擊復製',
    text231: '切換錢包中',
    text232: '切換錢包成功',
    text233: '發送失敗',
    text234: '取消委托失敗',
    text235: '初始化合約失敗',
    text236: '調用合約失敗',

    text237: '油費不足',
    text238: '地址有誤',
    text239: '區塊高度',
    text240: '自動領取獎勵',
    text241: '自定義代幣',
    text242: '添加代幣',
    text243: '代幣列表',
    text244: '代幣合約',
    text245: '请输入代币合约地址',
    text246: '代幣符號',
    text247: '請輸入代幣符號',
    text248: '代幣精度',
    text249: '保存',
    text250: '未查詢到合約信息，請檢查合約地址是否正確！',
    text251: '删减成功！',
    text252: '請完成代幣信息填寫！',
    text253: '已存在該代幣，請勿重復添加',
    text254: '添加代幣成功！',
    text255: '暫無代幣',
    text256: '未查詢到合約信息，請檢查合約地址是否正確！',
    text257: '刪除'
  },
  EN: {
    Mywallet: 'My Wallet',
    Totalassets: 'Total Assets',
    send: 'Send',
    receive: 'receive',
    delegate: 'delegate',
    trading: 'trading',
    searchPlaceholder: 'Enter contract address to inquire',
    homeAssets: 'Home asset management',
    Collectionaddress: 'Collection address',
    Sendamount: 'Send amount',
    Minersfee: 'Miners fee',
    Customdefinition: 'Custom definition',
    Transferconfirmation: 'Transfer confirmation',
    Sendaccount: 'Send account',
    Receivingaccount: 'Receiving account',
    Transferamount: 'Transfer amount',
    confirm: 'confirm',
    Slow: 'Slow',
    fast: 'fast',
    Recommend: 'Recommend',
    Available: 'Available',
    Passwordconfirmation: 'Password confirmation',
    'completeBackupToVerify': '完成备份，点击验证',
    'text01': 'Assets',
    'text02': 'Total Assets',
    'text03': 'Send',
    'text04': 'Recive',
    'text05': 'Stake',
    'text06': 'Transfer',
    'text07': 'Tokens',
    'text08': 'The current viewkey is inconsistent with the chain, and the token balance and transaction record will not be available. Please enter the token details page and click Set viewkey.',
    'text09': 'Confirm',
    'text10': 'Switch Wallets',
    'text11': 'Add Wallet',
    'text12': 'Create Wallet',
    'text13': 'Import Wallet',
    'text14': 'Cancel',
    'text15': 'Send',
    'text16': 'Receiver',
    'text17': 'Enter or paste the wallet address',
    'text18': 'Amount',
    'text19': 'Please enter the amount',
    'text20': 'Balance',
    'text21': 'All',
    'text22': 'Fee',
    'text23': 'Fast',
    'text24': 'REC',
    'text25': 'Slow',
    'text26': 'Seconds',
    'text27': 'Customize',
    'text28': 'Warning: address error, please enter the correct collection address!',
    'text29': 'There is no address yet. Click Add',
    'text30': 'QR Code',
    'text31': 'Album',
    'text32': 'Scan the QR code to initiate the transfer.',
    'text33': 'Token Selection',
    'text34': 'Warning: Gas Price is too low, which will affect the transaction confirmation time.',
    'text35': 'Warning：Gas is too low, please enter valid Gas',
    'text36': 'Confirm',
    'text37': 'The transaction was launched successfully!',
    'text38': 'Network Error!',
    'text39': 'Transfer warning: the current transfer limit reaches the set transaction prompt limit, which is a high-value transfer. Please confirm that this transfer is safe before continuing to complete the transfer operation.',
    'text40': 'Cancel',
    'text41': 'Confirm',
    'text42': 'Confirm Payment',
    'text43': 'Sender',
    'text44': 'Receiver',
    'text45': 'Amount',
    'text46': 'Fee',
    'text47': 'Confirm',
    'text48': 'Fund Password',
    'text49': 'Please enter your password.',
    'text50': 'Confirm ',
    'text51': 'Warning：Incorrect fund password, please re-enter',
    'text52': 'This address only supports hermit matrix network assets. Please do not transfer to other public chain assets',
    'text53': 'Scan QR code and transfer to hermit matrix network assets',
    'text54': 'Wallet Address',
    'text55': 'Click Copy',
    'text56': 'Copy Successfully!',
    'text57': 'Available',
    'text58': 'Locked',
    'text59': 'Send',
    'text60': 'Receive',
    'text61': 'Transfer',
    'text62': 'Stake',
    'text63': 'All',
    'text64': 'Send',
    'text65': 'Receive',
    'text66': 'Stake',
    'text67': 'Withdraw',
    'text68': 'Failed',
    'text69': 'Details',
    'text70': 'Receive',
    'text71': 'Scan the QR code and transfer GHM.',
    'text72': 'Address',
    'text73': 'Save the picture',
    'text74': 'Click Copy',
    'text75': 'Copy Successfully!',
    'text76': 'Basic Information',
    'text77': 'Project Dbbreviation',
    'text78': 'Full name of the project',
    'text79': 'Official Website',
    'text80': 'Contract Addresses',
    'text81': 'Release Information',
    'text82': 'Transaction Details',
    'text83': 'Transaction Status: Success, Failed, Failed Call Contract',
    'text84': 'Amount',
    'text85': 'Fee',
    'text86': 'Receiver',
    'text87': 'Sender',
    'text88': 'Nonce',
    'text89': 'Stake Amount',
    'text90': 'Delegator',
    'text91': 'Validator',
    'text92': 'Withdraw Amount',
    'text93': 'Operation Account',
    'text94': 'Withdraw Address',
    'text95': 'Send',
    'text96': 'Receive',
    'text97': 'Transfer',
    'text98': 'View / Set',
    'text99': 'Details',
    'text100': 'Transaction Type: All, Send, Receive, Failed',
    'text101': 'View Viewkey',
    'text102': 'Copy Viewkey',
    'text103': 'Copy Successfully!',
    'text104': 'Seting Viewkey',
    'text105': 'Execution of contract',
    'text106': 'Please enter memo (optional)',
    'text107': 'Confirm ',
    'text108': 'Confirm Payment',
    'text109': 'Execution of contract',
    'text110': 'Details',
    'text111': 'Fee',
    'text112': 'Confirm ',
    'text113': 'No record yet',
    'text114': 'There is no viewkey or the local viewkey is inconsistent with the chain. The record cannot be obtained. Please set it first!',
    'text115': 'Manage',
    'text116': 'Wallet Address',
    'text117': 'Wallet Name',
    'text118': 'Reset Wallet Password',
    'text119': 'Export Mnemonics',
    'text120': 'Export the private key',
    'text121': 'Export Keystore',
    'text122': 'Removal',
    'text123': 'Modify the name',
    'text124': 'Please enter a new name, no more than 10 characters',
    'text125': 'Cancel',
    'text126': 'Confirm ',
    'text127': 'The wallet name has been modified successfully!',
    'text128': 'Error prompt: The name exceeds 10 characters, please enter it again!',
    'text129': 'Password',
    'text130': 'Please enter your wallet password.',
    'text131': 'Cancel',
    'text132': 'Confirm ',
    'text133': 'Error prompt: Wallet password is incorrect, please confirm and re-enter!',
    'text134': 'Safety Tips',
    'text135': 'Do not take screenshots.',
    'text136': 'Backup Tips',
    'text137': 'Please save it offline. Do not save it to online tools such as mailboxes and chat applications. There is a risk of leakage.',
    'text138': 'Do not transfer through network tools. If acquired, account assets may be stolen and cannot be recovered.',
    'text139': 'Do not disclose or share the private key to anyone. Mastering the private key will gain ownership of the assets.',
    'text140': 'Public Key',
    'text141': 'Copy Successfully!',
    'text142': 'Verify the mnemonic',
    'text143': 'Please select the backup mnemonics in order.',
    'text144': 'Confirm ',
    'text145': 'The backup was successful!',
    'text146': 'Reset the password',
    'text147': 'Original Wallet Password Verification',
    'text148': 'Enter the original wallet password',
    'text149': 'Next',
    'text150': 'Warning： Incorrect fund password, please re-enter!',
    'text151': 'Set a new password',
    'text152': 'Next',
    'text153': 'Confirm the new password',
    'text154': 'Enter the new password again.',
    'text155': 'Confirm ',
    'text156': 'Entering the new password again does not match the first entry. Please confirm!',
    'text157': 'The new password cannot match the original password!',
    'text158': 'The wallet password has been changed successfully!',
    'text159': 'Removal Warning',
    'text160': 'After the wallet is removed, it will not be restored. Please be sure to complete the backup first, otherwise the lost assets cannot be recovered!',
    'text161': 'Cancel',
    'text162': 'Confirm ',
    'text163': 'The wallet was removed successfully!',
    'text164': 'Home Asset Management',
    'text165': 'Enter the contract address query',
    'text166': 'Popular Assets',
    'text167': ':Successfully added!',
    'text168': 'Support all Hermit Matix network tokens',
    'text169': 'Enter the contract address query',
    'text170': 'Cancel',
    'text171': 'Successful Deletion!',
    'text172': 'Warning',
    'text173': 'Miner fee settings',
    'text174': 'Receiver',
    'text175': 'Wallet Manager',
    'text176': 'Click to copy',
    'text177': 'Do not disclose or share the keystore to anyone. Mastering the keystore will gain ownership of the assets.',
    'text178': 'Do not disclose or share the mnemonic to anyone. Mastering the mnemonic will gain ownership of the assets.',
    text179: 'Mnemonic error prompt: mnemonic error, please check it!',
    text180: 'Under Development',
    text181: 'Success',
    text182: 'Failed',
    text183: 'My Wallet',
    text184: 'In Execution',
    text185: 'Success',
    text186: 'Fail',
    text187: 'Too many attempts. Please switch the authentication method!',
    text188: 'Collection address cannot be empty!',
    text189: 'Obtaining keystore is equivalent to owning the ownership of wallet assets',
    text190: 'Obtaining the private key is equivalent to owning the wallet assets',
    text191: 'Acquiring mnemonic words is equivalent to owning the wallet assets',
    text192: 'Select Token',
    text193: 'Available',
    text194: 'The entered amount exceeds the available balance of the wallet, please re-enter!',
    text195: 'Transfer amount cannot be empty!',
    text196: 'Fingerprint Verification',
    text197: 'Switch authentication mode',
    text198: 'Trading',
    text199: 'Wallet address cannot be empty!',
    text200: 'Wallet name cannot be empty!',
    text201: 'Verifying',
    text202: 'Success',
    text203: 'Fail',
    text204: 'Too many failed attempts, please try again later',
    text205: 'Please enter viewkey',
    text206: 'Click to load more',
    text207: 'Loading',
    text208: 'All loaded',
    text209: 'Current',
    text210: 'Viewkey cannot be empty!',
    text211: 'The wallet was removed successfully!',
    text212: 'No popular tokens yet',
    text213: 'Mnemonics',
    text214: 'Save and share',
    text215: 'Do not share and store screenshots, which may be collected by third-party malware, resulting in asset loss.',
    text216: 'Cancellation of commission amount',
    text217: 'Cancelled Verifier',
    text218: 'Complete the backup, click Verify',
    text219: 'The current transfer limit reaches the set transaction reminder limit, which is a high-value transfer. Please confirm that the transfer is safe before continuing to complete the transfer operation.',
    text220: 'The input address is incorrect, please check and re-enter',
    text221: 'The wallet password cannot be less than 8 digits',
    text222: 'Generating QR code',
    text223: 'Saved',
    text224: 'Public Key',
    text225: 'Keystore',
    text226: 'Cannot transfer to yourself',
    text227: 'End',
    text228: 'Gas is too low, please enter a valid GAS',
    text229: 'Note: The valuation of Gas Limit is affected by the amount, address and the Memo. Please fill in the information before obtaining the valuation;',
    text230: 'Click Copy',
    text231: 'Switching wallets',
    text232: 'Switch wallet successfully',
    text233: 'Failed to send',
    text234: 'Cancel delegation failed',
    text235: 'Failed to initialize contract',
    text236: 'Failed to call contract',

    text237: 'Insufficient fuel charge',
    text238: 'The address is wrong.',
    text239: 'Block Height',
    text240: 'ReceiveRewardsAutomatically',
    text241: 'Custom Token',
    text242: 'Add Tokens',
    text243: 'Token List',
    text244: 'Contract',
    text245: 'Please enter the token contract address',
    text246: 'Symbol',
    text247: 'Please enter token symbol',
    text248: 'Token accuracy',
    text249: 'Save',
    text250: 'Token information is not found,please check whether the contract is correct!',
    text251: 'Deletion succeeded！',
    text252: 'Please complete the token information!',
    text253: 'This token already exists, please do not add it again',
    text254: 'Token added successfully',
    text255: 'No token Yet',
    text256: 'No contract information is found, please check whether the contract address is correct!',
    text257: 'Delete'
  }
}
export default languages
