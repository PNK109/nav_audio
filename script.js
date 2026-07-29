const diagnostics = {
  voice: {
    archetype: "СОБИРАТЕЛЬ",
    title: "Нужна не новая техника, а точка сборки",
    text: "Соберём опыт, влияния и темы в авторскую позицию, из которой может родиться собственный проект.",
    route: "позиция → история → форма"
  },
  form: {
    archetype: "АРХИТЕКТОР",
    title: "Смысл уже есть: ему нужна конструкция",
    text: "Личный конфликт станет ясной структурой, посильным форматом и визуальной библией проекта.",
    route: "история → язык → тесты"
  },
  release: {
    archetype: "ПРОВОДНИК",
    title: "Продвижение начинается до публикации",
    text: "Соберём публичный пакет проекта и определим, кому, где и как его показывать.",
    route: "упаковка → публикация → связи"
  },
  system: {
    archetype: "ХРАНИТЕЛЬ",
    title: "Нужна система, которая переживёт вдохновение",
    text: "Один главный проект, правила фокуса и траектория на 90 дней заменят бесконечное распыление.",
    route: "фокус → завершение → продолжение"
  }
};

const modules = [
  {
    title: "Авторская позиция",
    subtitle: "Найти внутреннюю опору и сделать свой взгляд понятным другим.",
    count: "4 урока + ДЗ",
    duration: "2:43:27",
    lessons: [
      "Творчество как опора: части 1 и 2",
      "Живое мышление в эпоху алгоритмов и ИИ",
      "Самопрезентация и новая модель личного бренда"
    ],
    practice: "Авторское досье: кто говорит?",
    result: "Темы, опыт, источники, визуальные ориентиры и рабочая самопрезентация."
  },
  {
    title: "История и замысел",
    subtitle: "Превратить личный материал в историю и подготовить проект.",
    count: "3 урока + ДЗ",
    duration: "2:35:51",
    lessons: [
      "Сторителлинг: личный опыт в истории",
      "Форма подачи, личный бренд и визуальный стиль",
      "Препродакшн: от идеи к визуальному воплощению"
    ],
    practice: "Тема, форма и визуальный замысел",
    result: "Тема, конфликт, формат, сценарный план или тритмент и пакет подготовки."
  },
  {
    title: "Визуальный язык",
    subtitle: "Выражать эмоцию и смысл через кадр, а не набор приёмов.",
    count: "3 урока + ДЗ",
    duration: "3:07:39",
    lessons: [
      "Композиция, свет и оптика как язык эмоций",
      "Движение камеры и драматургия кадра",
      "Поиск собственного визуального стиля"
    ],
    practice: "Операторский тест и визуальные правила",
    result: "Визуальная библия, снятые тесты и понятный язык проекта."
  },
  {
    title: "Аудитория и ценность",
    subtitle: "Вывести работу во внешнее поле и построить живые связи.",
    count: "3 урока + ДЗ",
    duration: "2:03:28",
    lessons: [
      "Нетворкинг и создание сообщества",
      "Продвижение в цифровой среде",
      "Опыт как ценность, продукт и возможность"
    ],
    practice: "Первый контакт с аудиторией",
    result: "Карта сообщества, авторская экосистема и первый внешний контакт."
  },
  {
    title: "Устойчивый путь",
    subtitle: "Встроить творчество в реальную жизнь и выбрать посильный масштаб.",
    count: "3 урока + ДЗ",
    duration: "1:56:07",
    lessons: [
      "Кризисы и поиск новой опоры",
      "Поток, фокус и глубокая работа",
      "Востребованность и творческий путь вдолгую"
    ],
    practice: "Мой следующий реальный шаг",
    result: "Аудит ресурсов, система фокуса и траектория на следующие 90 дней."
  },
  {
    title: "Монтаж и выпуск",
    subtitle: "Превратить материал в законченное авторское высказывание.",
    count: "3 урока",
    duration: "3:01:06",
    lessons: [
      "Монтажное мышление: ритм, эмоция и структура",
      "Менеджмент материала и своего продакшна",
      "Дизайн, цвет, звук и финализация"
    ],
    practice: "Сборка и финализация проекта",
    result: "Монтажная структура, порядок в материале и презентабельная версия проекта."
  }
];

const reviews = [
  {
    name: "Владислав",
    date: "19.06.2026",
    text: "На самом деле большой тебе респект за такой подход к просмотру ДЗ: очень удобно смотреть видео и чувствуется заинтересованность. Рекомендации дельные, при этом не перегруженные формальностями."
  },
  {
    name: "Владислав",
    date: "03.07.2026",
    text: "Меня зацепила тема false color и цветовых контрастов. Раньше я о таких вещах не задумывался. Четвёртая глава дала общее понимание, куда стоит направить вектор развития в будущем."
  },
  {
    name: "Владислав",
    date: "03.07.2026",
    text: "Домашки просто восторг. Особенно по четвёртому блоку. Подробное описание к посту сильно облегчило его написание, а само написание помогло разобраться в собственной идее."
  },
  {
    name: "Vyacheslav Chuprow",
    date: "02.07.2026",
    text: "К концу четвёртого блока я понял, что не зря тут. Эти маленькие крупицы информации, которые беру от тебя, действительно дают мне рост как специалисту."
  },
  {
    name: "Anton Emelin",
    date: "02.06.2026",
    text: "Только дописал домашку. Думал, что быстренько на все вопросы отвечу, а по итогу потратил часа четыре. Сильные вопросы."
  },
  {
    name: "Anton Emelin",
    date: "05.06.2026",
    text: "Формат прямого диалога с большим количеством ссылок на личный опыт помогает на живом примере переложить историю на себя. Становится ясно, что человек знает, о чём говорит, и может это доносить."
  },
  {
    name: "Участница первого потока",
    date: "08.06.2026",
    text: "Ощущение, что это не обучение в менторском стиле, а доверительный разговор с другом, который вдохновляет на трансформацию и помогает увидеть себя яснее. Самым сильным оказалось ДЗ."
  },
  {
    name: "Егор Андреевич",
    date: "15.07.2026",
    text: "От души за обратную связь и такое включение. Я уже тонны курсов успел пройти, но такое включение вижу впервые."
  }
];

const diagnosticButtons = document.querySelectorAll(".diagnostic-option");
const diagnosticArchetype = document.querySelector("#diagnostic-archetype");
const diagnosticTitle = document.querySelector("#diagnostic-title");
const diagnosticText = document.querySelector("#diagnostic-text");
const diagnosticRoute = document.querySelector("#diagnostic-route");

diagnosticButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const data = diagnostics[button.dataset.diagnostic];
    diagnosticButtons.forEach((item) => {
      item.classList.toggle("is-active", item === button);
      item.setAttribute("aria-selected", item === button ? "true" : "false");
    });
    diagnosticArchetype.textContent = data.archetype;
    diagnosticTitle.textContent = data.title;
    diagnosticText.textContent = data.text;
    diagnosticRoute.textContent = data.route;
  });
});

const moduleTabs = document.querySelectorAll(".module-tab");
const moduleNumber = document.querySelector("#module-number");
const moduleCount = document.querySelector("#module-count");
const moduleDuration = document.querySelector("#module-duration");
const moduleTitle = document.querySelector("#module-title");
const moduleSubtitle = document.querySelector("#module-subtitle");
const moduleLessons = document.querySelector("#module-lessons");
const modulePractice = document.querySelector("#module-practice");
const moduleResult = document.querySelector("#module-result");
const moduleStage = document.querySelector("#module-stage");
const moduleProgress = document.querySelector("#module-progress");
const moduleIcon = document.querySelector("#module-icon");

function showModule(index) {
  const data = modules[index];
  moduleTabs.forEach((tab) => {
    const isActive = Number(tab.dataset.module) === index;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
  moduleNumber.textContent = String(index + 1).padStart(2, "0");
  moduleCount.textContent = data.count;
  moduleDuration.textContent = data.duration;
  moduleTitle.textContent = data.title;
  moduleSubtitle.textContent = data.subtitle;
  modulePractice.textContent = data.practice;
  moduleResult.textContent = data.result;
  moduleStage.textContent = `STAGE ${String(index + 1).padStart(2, "0")}`;
  moduleProgress.style.width = `${((index + 1) / modules.length) * 100}%`;
  moduleIcon.src = `assets/gif/module-${index + 1}.gif`;
  moduleLessons.replaceChildren(
    ...data.lessons.map((lesson) => {
      const item = document.createElement("li");
      item.textContent = lesson;
      return item;
    })
  );
}

moduleTabs.forEach((tab) => {
  tab.addEventListener("click", () => showModule(Number(tab.dataset.module)));
});

let currentReview = 0;
const reviewNumber = document.querySelector("#review-number");
const reviewTotal = document.querySelector("#review-total");
const reviewName = document.querySelector("#review-name");
const reviewDate = document.querySelector("#review-date");
const reviewText = document.querySelector("#review-text");

function showReview(index) {
  currentReview = (index + reviews.length) % reviews.length;
  const data = reviews[currentReview];
  reviewNumber.textContent = String(currentReview + 1).padStart(2, "0");
  reviewTotal.textContent = String(reviews.length).padStart(2, "0");
  reviewName.textContent = data.name;
  reviewDate.textContent = data.date;
  reviewText.textContent = data.text;
}

document.querySelector("#review-prev").addEventListener("click", () => showReview(currentReview - 1));
document.querySelector("#review-next").addEventListener("click", () => showReview(currentReview + 1));

const formatChoices = document.querySelectorAll(".format-choice");
const formatsTable = document.querySelector(".formats-table");

function selectFormat(format) {
  formatsTable.dataset.selected = format;
  formatChoices.forEach((choice) => {
    const isSelected = choice.dataset.format === format;
    choice.classList.toggle("is-selected", isSelected);
    choice.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
}

formatChoices.forEach((choice) => {
  choice.addEventListener("click", () => selectFormat(choice.dataset.format));
});

const grainCanvas = document.createElement("canvas");
const grainContext = grainCanvas.getContext("2d", { alpha: false });
const grainMotionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const grainPixelSize = 2;
const grainFrameInterval = 90;
let grainLastDraw = -grainFrameInterval;

grainCanvas.className = "film-grain";
grainCanvas.setAttribute("aria-hidden", "true");
document.body.append(grainCanvas);

function sizeGrainCanvas() {
  grainCanvas.width = Math.max(1, Math.ceil(window.innerWidth / grainPixelSize));
  grainCanvas.height = Math.max(1, Math.ceil(window.innerHeight / grainPixelSize));
  grainContext.imageSmoothingEnabled = false;
  grainLastDraw = -grainFrameInterval;
}

function paintGrain(now = 0) {
  if (now - grainLastDraw >= grainFrameInterval) {
    const frame = grainContext.createImageData(grainCanvas.width, grainCanvas.height);

    for (let index = 0; index < frame.data.length; index += 4) {
      const tone = 56 + Math.floor(Math.random() * 144);
      frame.data[index] = tone;
      frame.data[index + 1] = tone;
      frame.data[index + 2] = tone;
      frame.data[index + 3] = 255;
    }

    grainContext.putImageData(frame, 0, 0);
    grainLastDraw = now;
  }

  if (grainMotionAllowed) requestAnimationFrame(paintGrain);
}

window.addEventListener("resize", sizeGrainCanvas, { passive: true });
sizeGrainCanvas();
requestAnimationFrame(paintGrain);

const trailAllowed =
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (trailAllowed) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const points = [];
  const trailLength = 280;
  const trailLifetime = 680;
  let frame = 0;

  canvas.className = "cursor-trail";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);

  function sizeTrailCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function trimTrail(now) {
    while (points.length && now - points[0].time > trailLifetime) points.shift();

    let distance = 0;
    for (let index = points.length - 1; index > 0; index -= 1) {
      distance += Math.hypot(
        points[index].x - points[index - 1].x,
        points[index].y - points[index - 1].y
      );
      if (distance > trailLength) {
        points.splice(0, index);
        break;
      }
    }
  }

  function drawTrail(now) {
    frame = 0;
    trimTrail(now);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (points.length > 1) {
      const first = points[0];
      const last = points[points.length - 1];
      const gradient = context.createLinearGradient(first.x, first.y, last.x, last.y);
      const freshness = Math.max(0, 1 - (now - last.time) / trailLifetime);

      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(0.42, `rgba(255, 255, 255, ${0.28 * freshness})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${0.96 * freshness})`);

      context.beginPath();
      context.moveTo(first.x, first.y);
      for (let index = 1; index < points.length - 1; index += 1) {
        const point = points[index];
        const next = points[index + 1];
        context.quadraticCurveTo(
          point.x,
          point.y,
          (point.x + next.x) / 2,
          (point.y + next.y) / 2
        );
      }
      context.lineTo(last.x, last.y);
      context.strokeStyle = gradient;
      context.lineWidth = 2.2;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.shadowColor = "rgba(0, 0, 0, 0.28)";
      context.shadowBlur = 3;
      context.stroke();
      context.shadowBlur = 0;
    }

    if (points.length) frame = requestAnimationFrame(drawTrail);
  }

  function requestTrailFrame() {
    if (!frame) frame = requestAnimationFrame(drawTrail);
  }

  window.addEventListener("pointermove", (event) => {
    const events = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];
    const now = performance.now();
    events.forEach((sample, index) => {
      points.push({
        x: sample.clientX,
        y: sample.clientY,
        time: now - (events.length - index - 1)
      });
    });
    requestTrailFrame();
  }, { passive: true });

  window.addEventListener("resize", sizeTrailCanvas, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => {
    points.length = 0;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  });

  sizeTrailCanvas();
}

const grass = document.querySelector("#procedural-grass");

function buildGrass() {
  if (!grass) return;

  let seed = Math.max(320, window.innerWidth) + 109;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const bladeCount = Math.min(220, Math.max(64, Math.ceil(window.innerWidth / 7)));
  const fragment = document.createDocumentFragment();
  const colors = ["#4f9c35", "#68ad3d", "#3f842f", "#82bd43", "#2f7429"];

  for (let index = 0; index < bladeCount; index += 1) {
    const blade = document.createElement("i");
    const spread = ((index + random() * 0.9) / bladeCount) * 100;
    const angle = -7 + random() * 14;

    blade.className = "grass-blade";
    blade.style.setProperty("--grass-x", `${spread.toFixed(2)}%`);
    blade.style.setProperty("--grass-height", `${Math.round(34 + random() * 62)}px`);
    blade.style.setProperty("--grass-width", `${Math.round(3 + random() * 4)}px`);
    blade.style.setProperty("--grass-angle", `${angle.toFixed(1)}deg`);
    blade.style.setProperty("--grass-speed", `${(0.72 + random() * 1.05).toFixed(2)}s`);
    blade.style.setProperty("--grass-delay", `${(-random() * 1.8).toFixed(2)}s`);
    blade.style.setProperty("--grass-color", colors[Math.floor(random() * colors.length)]);
    fragment.append(blade);
  }

  grass.replaceChildren(fragment);
}

let grassResizeFrame = 0;
window.addEventListener("resize", () => {
  cancelAnimationFrame(grassResizeFrame);
  grassResizeFrame = requestAnimationFrame(buildGrass);
}, { passive: true });

buildGrass();
selectFormat("solo");
showReview(0);
showModule(0);

/*
 * Tilda T123 embed bridge.
 *
 * The course page is embedded cross-origin, so the parent Tilda page cannot
 * read its document height directly. Report the real rendered height whenever
 * content, images, fonts, or the viewport change. This code is inert when the
 * page is opened normally outside an iframe.
 */
if (window.parent !== window) {
  const embedMessageSource = "pankovskii-kl";
  let embedResizeFrame = 0;
  let lastEmbedHeight = 0;

  function measureEmbedHeight() {
    embedResizeFrame = 0;

    const bodyHeight = document.body
      ? Math.max(document.body.scrollHeight, document.body.offsetHeight)
      : 0;
    const rootHeight = Math.max(
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    const height = Math.ceil(Math.max(bodyHeight, rootHeight));

    if (height < 1 || Math.abs(height - lastEmbedHeight) < 2) return;
    lastEmbedHeight = height;

    window.parent.postMessage(
      {
        source: embedMessageSource,
        type: "resize",
        height
      },
      "*"
    );
  }

  function scheduleEmbedMeasurement() {
    cancelAnimationFrame(embedResizeFrame);
    embedResizeFrame = requestAnimationFrame(measureEmbedHeight);
  }

  window.addEventListener("load", scheduleEmbedMeasurement);
  window.addEventListener("resize", scheduleEmbedMeasurement, { passive: true });
  window.addEventListener("message", (event) => {
    if (
      event.data &&
      event.data.source === "tilda-kl" &&
      event.data.type === "request-size"
    ) {
      scheduleEmbedMeasurement();
    }
  });

  if ("ResizeObserver" in window && document.body) {
    new ResizeObserver(scheduleEmbedMeasurement).observe(document.body);
  }

  document.querySelectorAll("img").forEach((image) => {
    if (!image.complete) {
      image.addEventListener("load", scheduleEmbedMeasurement, { once: true });
      image.addEventListener("error", scheduleEmbedMeasurement, { once: true });
    }
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleEmbedMeasurement);
  }

  scheduleEmbedMeasurement();
  window.setTimeout(scheduleEmbedMeasurement, 500);
  window.setTimeout(scheduleEmbedMeasurement, 1600);
}
