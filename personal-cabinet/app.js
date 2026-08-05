    const DATA = {
      user:{id:"USER_0109",name:"Алексей Ветров",email:"ALEXEY@EXAMPLE.COM",joined:"18.05.2026",lastLogin:"05.08.2026 / 13:42 JST",role:"student"},
      folders:[
        {
          id:"forms",title:"Анкеты / Forms",short:"Анкеты",code:"CODE_004 // FORMS",index:"04-F",tone:"forms",locked:false,progress:80,
          status:"4 заполнено",
          fields:[["Профиль","Заполнен","Последнее изменение: 04.08.2026"],["Согласия","2 активно","Политика / оферта"],["Черновики","1 форма","Финальный отзыв"]],
          cards:[
            {title:"Последние формы",rows:[["04.08.26","Оценка модуля 3","SUBMITTED"],["02.06.26","Авторское досье","SUBMITTED"],["18.05.26","Входная анкета","SUBMITTED"]]},
            {title:"Доступные действия",rows:[["TODAY","Обновить профиль","OPEN"],["—","Финальный отзыв","LOCKED"],["—","Экспорт ответов","READY"]]},
            {title:"История согласий",rows:[["18.05.26","Публичная оферта","ACTIVE"],["18.05.26","Политика данных","ACTIVE"],["—","Рассылки","OFF"]]}
          ],
          notes:["63 ответа сохранено.","2 анкеты доступны для редактирования."],security:["ФОРМЫ ПРИВЯЗАНЫ К USER_0109","ИСТОРИЯ ИЗМЕНЕНИЙ ВКЛЮЧЕНА"],attachments:["FORM_EXPORT.CSV","CONSENTS.PDF"]
        },
        {
          id:"products",title:"Продукты / Products",short:"Продукты",code:"CODE_003 // PRODUCTS",index:"03-P",tone:"products",locked:false,progress:75,
          status:"3 активно",
          fields:[["Покупки","4 продукта","2 платных / 2 бесплатных"],["Сумма","99 000 ₽","Подтверждённые оплаты"],["Файлы","27 материалов","Видео / PDF / шаблоны"]],
          cards:[
            {title:"Приобретено",rows:[["18.05.26","Кинематограф личности","ACTIVE"],["28.07.26","10 схем света I","AVAILABLE"],["28.07.26","10 схем света II","AVAILABLE"]]},
            {title:"Доступы",rows:[["31.12.26","Курс / все модули","ACTIVE"],["∞","Личное досье","ACTIVE"],["—","НАВЬ.КРУГ","NO ACCESS"]]},
            {title:"Документы",rows:[["18.05.26","Чек №18427","READY"],["05.08.26","Сертификат КЛ","READY"],["—","Архив данных","EXPORT"]]}
          ],
          notes:["Последняя покупка: 18.05.2026.","Все чеки доступны для скачивания."],security:["PAYMENT_STATUS: VERIFIED","ACCESS_SYNC: OK"],attachments:["RECEIPT_18427.PDF","CERTIFICATE_KL.PDF"]
        },
        {
          id:"course",title:"Обучение / Course",short:"Обучение",code:"CODE_002 // COURSE",index:"02-C",tone:"course",locked:true,progress:58,
          status:"Модуль 4",
          fields:[["Курс","Кинематограф личности","Поток 01 / групповой"],["Пройдено","58%","Для сертификата требуется ≥ 50%"],["Домашние","4 / 8","Одна работа на проверке"]],
          cards:[
            {title:"Текущий этап",rows:[["NOW","Монтаж и звук","ACTIVE"],["10.08.26","Rough cut","NEXT"],["—","Публичная упаковка","LOCKED"]]},
            {title:"Домашние работы",rows:[["28.07.26","Авторское досье v.2","REWORK"],["04.08.26","Визуальная формула","REVIEW"],["24.07.26","Три визуальных теста","ACCEPTED"]]},
            {title:"Авторский пакет",rows:[["21.07.26","Проект «Следы»","ACTIVE"],["24.07.26","Визуальная библия","READY"],["—","План публикации","NOT STARTED"]]}
          ],
          notes:["Текущая точка: сборка rough cut.","Последняя активность: 8 дней назад."],security:["STUDENT_ONLY","MENTOR_ACCESS: ON"],attachments:["VISUAL_BIBLE.PDF","HOMEWORK_LOG.CSV"]
        },
        {
          id:"dossier",title:"Досье / Dossier",short:"Досье",code:"CODE_001 // DOSSIER",index:"01-D",tone:"dossier",locked:false,progress:75,
          status:"Active",
          fields:[["Name","Алексей Ветров","ALEXEY VETROV"],["ID","USR_24_7A91","CODE_001_01"],["Email","ALEXEY@EXAMPLE.COM","VERIFIED"],["Joined","18.05.2026","09:47:12"]],
          cards:[
            {title:"Последняя запись",rows:[["05.08.26","Обновление профиля","COMPLETE"],["28.07.26","Созвон с наставником","LOGGED"],["24.07.26","Сдача визуальных тестов","ACCEPTED"]]},
            {title:"Курс и прогресс",rows:[["NOW","Модуль 4 / монтаж","ACTIVE"],["58%","19 из 31 урока","PROGRESS"],["4/8","Домашние работы","COMPLETE"]]},
            {title:"История взаимодействия",rows:[["4","Приобретённых продукта","ACTIVE"],["4","Заполненные анкеты","SUBMITTED"],["7","События профиля","ARCHIVED"]]}
          ],
          notes:["Профиль заполнен на 75%.","Рекомендуется добавить аватар и краткое био."],security:["2FA: ON","LAST LOGIN: 05.08.26 / 13:42"],attachments:["DOSSIER_EXPORT.PDF","PROFILE_HISTORY.CSV"]
        }
      ]
    };

    const deck=document.getElementById('deck');
    let currentRole=DATA.user.role;
    let opened=null;

    const esc=(v='')=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
    const isLocked=(folder)=>folder.locked&&currentRole!=="student";

    function fieldRows(folder){
      const rows=folder.id==="dossier"?folder.fields:folder.fields.map(([a,b,c])=>[a,b,c]);
      return rows.map(([label,value,sub])=>`<div class="field"><div class="field__label">${esc(label)}</div><div class="field__value">${esc(value)}<span class="field__sub">${esc(sub)}</span></div></div>`).join('');
    }

    function cardMarkup(card){
      return `<section class="card"><div class="card__head"><span>${esc(card.title)}</span><span>■</span></div><div class="card__rows">${card.rows.map(([date,name,state])=>`<div class="row"><div class="row__date">${esc(date)}</div><div class="row__main"><strong>${esc(name)}</strong><small>ID: ${Math.random().toString(36).slice(2,8).toUpperCase()}</small></div><div class="row__state">${esc(state)}</div></div>`).join('')}</div></section>`;
    }

    function panelMarkup(folder){
      if(isLocked(folder)){
        return `<section class="panel" aria-label="${esc(folder.title)}"><button class="close" type="button" aria-label="Закрыть">×</button><div class="locked-view"><div class="locked-view__code">ERROR_403 // STUDENT ACCESS ONLY</div><h2>ДОСЬЕ ЗАКРЫТО</h2><p>Учебная картотека доступна только студентам курса. Обычный пользователь видит личное досье, приобретённые продукты и заполненные анкеты, но не домашние работы, прогресс и внутреннюю обратную связь.</p></div></section>`;
      }
      return `<section class="panel" aria-label="${esc(folder.title)}">
        <button class="close" type="button" aria-label="Закрыть папку">×</button>
        <header class="panel__top"><div><h1 class="panel__title">${esc(folder.title)}</h1><p class="panel__kicker">ЛИЧНЫЙ КАБИНЕТ / PERSONAL ACCOUNT<br>${esc(folder.code)} // ACTIVE FILE</p></div><div class="panel__meta"><span class="barcode"></span>FILE_${esc(folder.index)} //<br>UPDATED: 05.08.2026<br>VERSION: 0.9.2</div></header>
        <div class="summary">
          <div class="portrait" aria-label="Заглушка фотографии пользователя"></div>
          <div class="fields">${fieldRows(folder)}</div>
          <aside class="status-card"><div class="status-card__head"><div class="status-card__label">STATUS</div><div class="status-line"><span class="status-dot"></span><span>${esc(folder.status)}</span></div></div><div class="status-card__progress"><div class="progress-head"><span>PROGRESS</span><span>${folder.progress}%</span></div><div class="progress" style="--progress:${folder.progress}%"><i></i></div><div class="progress-note">${folder.progress} / 100 // DATA COMPLETENESS</div></div></aside>
        </div>
        <div class="cards">${folder.cards.map(cardMarkup).join('')}</div>
        <div class="bottom-strip"><div><h3>NOTES</h3><p>${folder.notes.map(esc).join('<br>')}</p></div><div><h3>SECURITY</h3><p>${folder.security.map(esc).join('<br>')}</p></div><div><h3>ATTACHMENTS</h3><p>${folder.attachments.map(esc).join('<br>')}</p></div></div>
      </section>`;
    }

    function folderMarkup(folder,index){
      const locked=isLocked(folder);
      const isOpen=opened===folder.id;
      return `<article class="folder ${isOpen?'is-open':''} ${locked?'is-locked':''}" data-id="${esc(folder.id)}" data-tone="${esc(folder.tone)}" style="--order:${index}" tabindex="0" role="button" aria-expanded="${isOpen}" aria-label="${esc(folder.title)}${locked?', доступ ограничен':''}">
        <div class="folder__body"><div class="spine" aria-hidden="true"><div class="spine__code">${esc(folder.code)}</div><div class="spine__mark"></div><div class="spine__micro">ARCHIVE_${String(index+1).padStart(2,'0')} // PRIVATE</div><div class="spine__barcode"></div><div class="spine__title">${esc(folder.title)}</div><div class="spine__index">${esc(folder.index)}</div><div class="spine__lock">LOCKED</div></div>${isOpen?panelMarkup(folder):''}</div>
      </article>`;
    }

    function render(){
      deck.innerHTML=DATA.folders.map(folderMarkup).join('');
      deck.classList.toggle('has-open',Boolean(opened));
      deck.querySelectorAll('.folder').forEach(folder=>{
        folder.addEventListener('click',event=>{
          if(event.target.closest('.close')){closeFolder();return}
          if(event.target.closest('.panel'))return;
          openFolder(folder.dataset.id);
        });
        folder.addEventListener('keydown',event=>{
          if(event.key==='Enter'||event.key===' '){event.preventDefault();openFolder(folder.dataset.id)}
        });
      });
    }

    function openFolder(id){
      if(!DATA.folders.some(f=>f.id===id))return;
      opened=id;render();
      requestAnimationFrame(()=>deck.querySelector(`[data-id="${CSS.escape(id)}"] .panel`)?.scrollTo({top:0}));
    }
    function closeFolder(){const prior=opened;opened=null;render();if(prior)deck.querySelector(`[data-id="${CSS.escape(prior)}"]`)?.focus({preventScroll:true})}

    document.querySelectorAll('.role-switch button').forEach(btn=>btn.addEventListener('click',()=>{
      currentRole=btn.dataset.role;
      document.querySelectorAll('.role-switch button').forEach(item=>item.setAttribute('aria-pressed',String(item===btn)));
      render();
    }));
    window.addEventListener('keydown',event=>{if(event.key==='Escape'&&opened)closeFolder()});

    render();
