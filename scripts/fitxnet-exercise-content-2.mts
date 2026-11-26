/**
 * Content for the second batch of Fitxnet exercises (74 GIF-sourced videos).
 * Same shape as fitxnet-exercise-content.mts; merged by apply-fitxnet-content.mts.
 */
import type { Content } from "./fitxnet-exercise-content.mts";

type P = [string, string];
const c = (d: P, i: P, m: P, t: P): Content => ({
  d: { ar: d[0], en: d[1] },
  i: { ar: i[0], en: i[1] },
  m: { ar: m[0], en: m[1] },
  t: { ar: t[0], en: t[1] },
});

/** Biceps curl family: shared steps 2–4, custom description/setup/tip. */
const curl = (d: P, setup: P, t: P, m: P = ["هز الجسم لرفع الوزن، تحريك الكوع لقدام، النزول نص المسافة.", "Swinging the body, letting the elbows drift forward, half reps."]) =>
  c(
    d,
    [
      `1. ${setup[0]}\n2. اثني الكوع وارفع الوزن ناحية الكتف والكوع ثابت جنب جسمك.\n3. اعصر الباي في الأعلى ثانية.\n4. نزّل ببطء لحد ما الدراع يتفرد.`,
      `1. ${setup[1]}\n2. Curl the weight toward your shoulder, keeping the elbows pinned at your sides.\n3. Squeeze the biceps for a second at the top.\n4. Lower slowly until the arm is straight.`,
    ],
    m,
    t,
  );

/** Triceps pushdown family. */
const pushdown = (d: P, setup: P, t: P) =>
  c(
    d,
    [
      `1. ${setup[0]}\n2. ثبت الكوع لازق في جنبك.\n3. افرد دراعك لتحت لآخره واعصر التراي.\n4. ارجع ببطء لحد ما الكوع يبقى حوالي 90 درجة.`,
      `1. ${setup[1]}\n2. Pin your elbows to your sides.\n3. Extend your arms fully down and squeeze the triceps.\n4. Return slowly until the elbows are about 90°.`,
    ],
    ["تحريك الكوع لقدام وورا، الميل بالجسم فوق الكابل، استخدام الكتف في الدفع.", "Elbows moving back and forth, leaning over the cable, pushing with the shoulders."],
    t,
  );

export const CONTENT_2: Record<string, Content> = {
  // ───────────── باي ─────────────
  "باي/باي بار": curl(
    ["باي بالبار المستقيم، التمرين الأساسي لبناء حجم وقوة الباي.", "Straight barbell curl, the classic mass and strength builder for the biceps."],
    ["اقف مفرود وامسك البار بعرض الكتف والكفوف لقدام.", "Stand tall holding the bar shoulder-width, palms facing forward."],
    ["لو الرسغ بيوجعك استخدم بار Z.", "If your wrists hurt, switch to an EZ bar."],
  ),
  "باي/باي بار Z": curl(
    ["باي بالبار Z، أريح على الرسغ من البار المستقيم.", "EZ-bar curl, easier on the wrists than a straight bar."],
    ["اقف وامسك البار Z من المسكة المايلة بعرض الكتف.", "Stand holding the EZ bar on the angled grips, shoulder-width."],
    ["ممتاز كبديل للبار المستقيم مع نفس الوزن تقريبًا.", "A great swap for the straight bar at a similar load."],
  ),
  "باي/باي بار قبضة واسعة": curl(
    ["باي بالبار بقبضة واسعة، بيركز على الرأس القصيرة (الداخلية) للباي.", "Wide-grip barbell curl emphasizing the short (inner) head of the biceps."],
    ["امسك البار أوسع من الكتف والكفوف لقدام.", "Grip the bar wider than shoulders, palms forward."],
    ["ماتوسعش القبضة لدرجة إن الكتف يوجعك.", "Don't go so wide that your shoulders feel strained."],
  ),
  "باي/باي بار قبضة ضيقة": curl(
    ["باي بالبار بقبضة ضيقة، بيركز على الرأس الطويلة (الخارجية) للباي.", "Close-grip barbell curl emphasizing the long (outer) head of the biceps."],
    ["امسك البار بقبضة أضيق من الكتف والكفوف لقدام.", "Grip the bar narrower than shoulder-width, palms forward."],
    ["ركز إن الكوع مايفتحش لبره مع القبضة الضيقة.", "Keep the elbows from flaring out with the narrow grip."],
  ),
  "باي/باي دمبل بالتبادل واقف": curl(
    ["باي دمبل بالتبادل، دراع ورا التاني، بيسمح بتركيز أكبر على كل دراع.", "Alternating dumbbell curl, one arm at a time for better focus on each side."],
    ["اقف والدمبلز جنبك وكفوفك لجوه، وارفع دراع واحد في كل مرة مع لف الكف لفوق.", "Stand with dumbbells at your sides, palms in; curl one arm at a time, turning the palm up."],
    ["لف الكف لفوق وانت طالع بيزود انقباض الباي.", "Turning the palm up as you lift increases the biceps contraction."],
  ),
  "باي/باي دمبل بالتبادل واقف 2": curl(
    ["نسخة تانية من باي الدمبل بالتبادل لتنويع التمرين.", "A variation of the alternating dumbbell curl for variety."],
    ["اقف مفرود والدمبلز جنبك، وارفع دراع ونزله قبل ما ترفع التاني.", "Stand tall with dumbbells at your sides; lift one arm and lower it before the other."],
    ["خلي الدراع اللي مش شغال مفرود وثابت تحت.", "Keep the resting arm straight and still at your side."],
  ),
  "باي/باي دمبل بالإيدين مع بعض": curl(
    ["باي دمبل بالإيدين في نفس الوقت.", "Dumbbell curl with both arms together."],
    ["اقف والدمبلز جنبك والكفوف لقدام.", "Stand with dumbbells at your sides, palms forward."],
    ["الإيدين مع بعض بيخليك ترفع وزن أكتر، بس خلي الجسم ثابت.", "Curling both arms lets you go heavier — just keep your torso still."],
  ),
  "باي/باي دمبل 3": curl(
    ["نسخة تالتة من باي الدمبل لتنويع الزاوية.", "A third dumbbell curl variation to vary the angle."],
    ["اقف مفرود والدمبلز جنبك.", "Stand tall with dumbbells at your sides."],
    ["غيّر بين النسخ المختلفة كل كام أسبوع.", "Rotate between curl variations every few weeks."],
  ),
  "باي/باي دمبل على بنش مائل": curl(
    ["باي دمبل وانت قاعد على بنش مائل، بيدي مط أكبر للرأس الطويلة للباي.", "Incline dumbbell curl, giving a bigger stretch on the biceps long head."],
    ["اقعد على بنش مائل 45-60 درجة والدراع متعلق لتحت.", "Sit on a 45–60° incline bench with arms hanging straight down."],
    ["استخدم وزن أخف من الباي الواقف بسبب المط الكبير.", "Use lighter weight than standing curls because of the big stretch."],
    ["رفع الكتف من على البنش، تحريك الكوع لقدام، النزول بسرعة.", "Lifting the shoulders off the bench, elbows drifting forward, dropping fast."],
  ),
  "باي/هامر دمبل": curl(
    ["هامر كيرل بالدمبل، بيشغل الباي وعضلة البراكياليس والساعد.", "Dumbbell hammer curl for the biceps, brachialis and forearms."],
    ["اقف والدمبلز جنبك والكفوف قصاد بعض (زي مسكة الشاكوش) وثبتها كده طول الحركة.", "Stand with dumbbells at your sides, palms facing each other (hammer grip) throughout."],
    ["ممتاز لتعريض الدراع من الجنب.", "Great for adding width to the arm from the side."],
  ),
  "باي/هامر كابل بالحبل": curl(
    ["هامر كيرل بالحبل على الكابل، شد مستمر على البراكياليس والساعد.", "Cable rope hammer curl with constant tension on the brachialis and forearms."],
    ["حط البكرة تحت وركب الحبل، وامسكه والكفوف قصاد بعض.", "Set the pulley low with a rope; hold it with palms facing each other."],
    ["الكابل بيدي شد طول الحركة أكتر من الدمبل.", "The cable keeps tension through the whole range, more than dumbbells."],
  ),
  "باي/كونسنتريشن كيرل": curl(
    ["كونسنتريشن كيرل، عزل كامل للباي وانت قاعد.", "Concentration curl, full biceps isolation while seated."],
    ["اقعد على بنش وسند الكوع على الفخد من جوه والدمبل متعلق.", "Sit on a bench, brace the elbow on your inner thigh with the dumbbell hanging."],
    ["حركة بطيئة وانقباض قوي أهم من الوزن.", "Slow reps and a hard squeeze matter more than weight."],
    ["رفع الكوع من على الفخد، لف الجسم، النزول بسرعة.", "Lifting the elbow off the thigh, twisting the torso, dropping fast."],
  ),
  "باي/باي سكوت بالبار Z": curl(
    ["باي سكوت (بريتشر) بالبار Z، بيعزل الباي ويمنع الغش.", "EZ-bar preacher curl that isolates the biceps and prevents cheating."],
    ["اقعد على بنش السكوت والدراع مسنود على المسند وامسك البار Z.", "Sit at the preacher bench, arms on the pad, holding the EZ bar."],
    ["ماتفردش الدراع لآخره بعنف في الأسفل علشان تحمي الكوع.", "Don't snap to full lockout at the bottom — protect the elbows."],
    ["رفع المؤخرة من على الكرسي، النزول بسرعة، فرد الكوع بعنف.", "Lifting off the seat, dropping fast, hyperextending the elbow."],
  ),
  "باي/باي سكوت بالماكينة": curl(
    ["باي سكوت على الماكينة، عزل آمن للباي.", "Machine preacher curl, a safe biceps isolation exercise."],
    ["اظبط الكرسي بحيث الإبط على حافة المسند وامسك المقابض.", "Set the seat so your armpits rest on the pad edge, grab the handles."],
    ["الماكينة مناسبة جدًا لعدات عالية في آخر التمرين.", "The machine is great for high-rep finishers."],
    ["رفع الجسم من على الكرسي، مدى حركة قصير، رجوع سريع.", "Rising off the seat, short range, fast return."],
  ),
  "باي/سبايدر كيرل بالبار": curl(
    ["سبايدر كيرل وصدرك على بنش مائل، بيعزل الباي تمامًا.", "Spider curl chest-down on an incline bench for strict biceps isolation."],
    ["نام بصدرك على بنش مائل والدراع متعلق لتحت ماسك البار.", "Lie chest-down on an incline bench, arms hanging straight down holding the bar."],
    ["ركز على الانقباض في الأعلى لأن مافيش غش ممكن هنا.", "Focus on the top squeeze — there's no way to cheat here."],
  ),
  "باي/باي كابل بالبار": curl(
    ["باي على الكابل بالبار، شد مستمر على الباي.", "Cable bar curl with constant tension on the biceps."],
    ["حط البكرة تحت وركب بار مستقيم، وامسكه بعرض الكتف.", "Set the pulley low with a straight bar, grip shoulder-width."],
    ["اقف قريب من الكابل علشان الشد يفضل على الباي.", "Stand close to the cable so tension stays on the biceps."],
  ),
  "باي/باي كابل بالبار 2": curl(
    ["نسخة تانية من باي الكابل بالبار.", "A cable bar curl variation."],
    ["حط البكرة تحت وامسك البار واقف مفرود.", "Set the pulley low, hold the bar and stand tall."],
    ["ثبت ثانية فوق وخلي النزول 3 ثواني.", "Pause at the top and take 3 seconds on the way down."],
  ),
  "باي/باي كابل بذراع واحدة": curl(
    ["باي كابل بدراع واحد، بيصلح الفرق بين الدراعين.", "Single-arm cable curl that fixes left/right imbalances."],
    ["حط البكرة تحت وامسك المقبض بإيد واحدة.", "Set the pulley low and hold the handle with one hand."],
    ["ابدأ بالدراع الأضعف.", "Start with your weaker arm."],
  ),
  "باي/باي كابل عالي": curl(
    ["باي كابل من فوق بالدراعين مفتوحين، بيركز على قمة الباي.", "High cable curl with arms out to the sides, emphasizing the biceps peak."],
    ["اقف بين بكرتين عاليين وامسك المقبضين والدراع مفرود لجنبك في مستوى الكتف.", "Stand between two high pulleys, holding the handles with arms out at shoulder height."],
    ["الكوع يفضل ثابت في مستوى الكتف طول الحركة.", "Keep the elbows fixed at shoulder height throughout."],
    ["نزول الكوع، استخدام الضهر، وزن تقيل يبوظ الحركة.", "Elbows dropping, using the back, going too heavy."],
  ),

  // ───────────── تراي ─────────────
  "تراي/تراي كابل بالحبل": pushdown(
    ["تراي بوش داون بالحبل، من أشهر تمارين عزل التراي.", "Cable rope pushdown, one of the most popular triceps isolation moves."],
    ["حط البكرة فوق وركب الحبل وامسكه والكفوف قصاد بعض.", "Set the pulley high with a rope; hold it with palms facing each other."],
    ["افتح الحبل لبره في الأسفل لانقباض أقوى.", "Spread the rope apart at the bottom for a stronger contraction."],
  ),
  "تراي/تراي كابل بالحبل 2": pushdown(
    ["نسخة تانية من تراي الحبل على الكابل.", "A cable rope pushdown variation."],
    ["حط البكرة فوق وامسك الحبل واقف مفرود.", "Set the pulley high, hold the rope and stand tall."],
    ["ثبت ثانية تحت وخلي الرجوع بطيء.", "Pause at the bottom and control the return."],
  ),
  "تراي/تراي كابل بالبار": pushdown(
    ["تراي بوش داون بالبار، بيسمح بوزن أعلى من الحبل.", "Cable bar pushdown, allows heavier loads than the rope."],
    ["حط البكرة فوق وامسك البار والكفوف لتحت بعرض الكتف.", "Set the pulley high, grip the bar overhand at shoulder width."],
    ["الرسغ مفرود ومايتنيش لتحت.", "Keep the wrists straight, not bent down."],
  ),
  "تراي/تراي كابل قبضة عكسية": pushdown(
    ["تراي كابل بقبضة عكسية (الكف لفوق)، بيركز على الرأس الجانبية والوسطى.", "Reverse-grip cable pushdown (palm up), emphasizing the medial/lateral heads."],
    ["حط البكرة فوق وامسك المقبض والكف لفوق.", "Set the pulley high and grip the handle palm-up."],
    ["استخدم وزن أخف من القبضة العادية.", "Use lighter weight than the regular grip."],
  ),
  "تراي/تراي كابل وانت راكع": pushdown(
    ["تراي كابل وانت راكع أو قاعد، بيثبت الجسم ويمنع الغش.", "Kneeling cable pushdown that locks the body in and prevents cheating."],
    ["اركع قدام الكابل والبكرة فوق وامسك المقبض.", "Kneel facing the cable with the pulley high and grab the handle."],
    ["الوضع ده بيمنع إنك تستخدم وزن جسمك.", "This position stops you from using body weight."],
  ),
  "تراي/تراي دمبل خلف الراس بذراع واحدة": c(
    ["تراي دمبل فوق الراس بدراع واحد، بيمط الرأس الطويلة للتراي.", "One-arm overhead dumbbell extension that stretches the triceps long head."],
    [
      "1. اقف أو اقعد وارفع الدمبل فوق راسك بدراع واحد.\n2. نزّل الدمبل ورا راسك بثني الكوع والكوع ثابت لفوق.\n3. افرد الدراع لفوق تاني.\n4. كمّل العدات وبدّل.",
      "1. Stand or sit and press the dumbbell overhead with one arm.\n2. Lower it behind your head by bending the elbow, elbow pointing up.\n3. Extend back to the top.\n4. Finish the reps, then switch.",
    ],
    ["الكوع يفتح لبره، تقويس الضهر، النزول بسرعة.", "Elbow flaring out, arching the back, dropping fast."],
    ["امسك الكوع بإيدك التانية علشان يفضل ثابت.", "Support the elbow with your free hand to keep it still."],
  ),
  "تراي/تراي دمبل خلف الراس بالإيدين": c(
    ["تراي دمبل فوق الراس بالإيدين، بيبني حجم التراي.", "Two-hand overhead dumbbell extension for triceps size."],
    [
      "1. امسك دمبل واحد بالإيدين من الطارة وارفعه فوق راسك.\n2. نزّله ورا راسك والكوع لفوق.\n3. افرد دراعاتك لفوق.\n4. شد البطن طول الحركة.",
      "1. Hold one dumbbell by the plate with both hands overhead.\n2. Lower it behind your head, elbows pointing up.\n3. Extend your arms back up.\n4. Keep your core braced throughout.",
    ],
    ["الكوع يفتح لبره، تقويس أسفل الضهر، مدى قصير.", "Elbows flaring, arching the lower back, short range."],
    ["لو بتقوّس ضهرك اعمله قاعد على بنش بمسند.", "If your back arches, do it seated on a bench with back support."],
  ),
  "تراي/سكال كراشر بالبار Z": c(
    ["سكال كراشر بالبار Z، من أقوى تمارين حجم التراي.", "EZ-bar skull crusher, a top triceps mass builder."],
    [
      "1. نام على بنش مستوي وامسك البار Z فوق صدرك والدراع مفرود.\n2. نزّل البار ناحية جبهتك بثني الكوع بس.\n3. افرد دراعاتك لفوق تاني.\n4. الكوع يفضل ثابت ومايفتحش.",
      "1. Lie on a flat bench holding the EZ bar above your chest, arms straight.\n2. Lower the bar toward your forehead by bending only the elbows.\n3. Extend back up.\n4. Keep the elbows fixed and tucked.",
    ],
    ["الكوع يفتح لبره، تحريك الكتف، النزول بسرعة.", "Elbows flaring, moving at the shoulders, dropping fast."],
    ["نزّل البار ورا راسك شوية بدل الجبهة لمط أكبر.", "Lower slightly behind the head instead of to the forehead for more stretch."],
  ),
  "تراي/سكال كراشر بالدمبل": c(
    ["سكال كراشر بالدمبل، أريح على الكوع والرسغ.", "Dumbbell skull crusher, easier on the elbows and wrists."],
    [
      "1. نام على بنش والدمبلز فوقك والكفوف قصاد بعض.\n2. نزّل الدمبلز جنب راسك بثني الكوع.\n3. افرد دراعاتك لفوق.\n4. الكوع ثابت طول الحركة.",
      "1. Lie on a bench with dumbbells above you, palms facing each other.\n2. Lower them beside your head by bending the elbows.\n3. Extend back up.\n4. Keep the elbows still.",
    ],
    ["الكوع يفتح، تحويلها لحركة ضغط، وزن تقيل زيادة.", "Elbows flaring, turning it into a press, going too heavy."],
    ["ابدأ بوزن خفيف وزوّد تدريجيًا.", "Start light and build gradually."],
  ),
  "تراي/سكال كراشر على بنش مائل": c(
    ["سكال كراشر على بنش مائل، بيزود المط على الرأس الطويلة للتراي.", "Incline skull crusher with extra stretch on the triceps long head."],
    [
      "1. نام على بنش مائل وامسك البار فوقك.\n2. نزّل البار ورا راسك بثني الكوع.\n3. افرد لفوق.\n4. الكوع ثابت.",
      "1. Lie on an incline bench holding the bar overhead.\n2. Lower it behind your head by bending the elbows.\n3. Extend back up.\n4. Keep the elbows still.",
    ],
    ["الكوع يفتح، تحريك الكتف، النزول بسرعة.", "Elbows flaring, moving the shoulders, dropping fast."],
    ["وزن أخف من المستوي بسبب المط الأكبر.", "Use less weight than the flat version due to the bigger stretch."],
  ),
  "تراي/كيك باك دمبل": c(
    ["كيك باك بالدمبل، عزل للتراي مع انقباض قوي.", "Dumbbell kickback, triceps isolation with a strong contraction."],
    [
      "1. اسند إيد وركبة على البنش والضهر مفرود.\n2. ارفع الكوع لحد مستوى جسمك وثبته.\n3. افرد الدراع لورا لآخره واعصر التراي.\n4. ارجع ببطء لحد 90 درجة.",
      "1. One hand and knee on a bench, back flat.\n2. Raise the elbow to torso level and lock it there.\n3. Extend the arm fully back and squeeze.\n4. Return slowly to 90°.",
    ],
    ["الكوع ينزل، مرجحة الدمبل، وزن تقيل.", "Elbow dropping, swinging the dumbbell, going too heavy."],
    ["وزن خفيف وثبتة ثانية في الآخر.", "Light weight with a one-second hold at full extension."],
  ),
  "تراي/بنش برس قبضة ضيقة": c(
    ["بنش برس بقبضة ضيقة، تمرين مركب للتراي والصدر.", "Close-grip bench press, a compound triceps and chest lift."],
    [
      "1. نام على البنش وامسك البار بعرض الكتف أو أضيق شوية.\n2. نزّل البار لأسفل الصدر والكوع لازق في الجسم.\n3. ادفع لفوق.\n4. الرسغ مفرود فوق الكوع.",
      "1. Lie on the bench, grip the bar shoulder-width or slightly narrower.\n2. Lower to the lower chest with elbows tucked.\n3. Press back up.\n4. Keep wrists stacked over elbows.",
    ],
    ["قبضة ضيقة زيادة تضغط على الرسغ، فتح الكوع، خبط البار في الصدر.", "Grip too narrow (wrist strain), flaring elbows, bouncing the bar."],
    ["عرض الكتف كفاية، مش لازم الإيدين يلزقوا.", "Shoulder-width is enough — hands don't need to touch."],
  ),
  "تراي/ديبس على المتوازي": c(
    ["ديبس على المتوازي، من أقوى تمارين التراي بوزن الجسم.", "Parallel bar dips, one of the best bodyweight triceps builders."],
    [
      "1. اسند على المتوازي والدراع مفرود.\n2. انزل بثني الكوع لحد ما يبقى 90 درجة والجسم مفرود.\n3. ادفع لفوق لحد ما الدراع يتفرد.\n4. الكوع ورا مش لبره.",
      "1. Support yourself on the bars, arms straight.\n2. Lower by bending the elbows to 90°, body upright.\n3. Push back up to straight arms.\n4. Keep elbows back, not flared.",
    ],
    ["النزول عميق زيادة يضغط على الكتف، الكوع يفتح، المرجحة.", "Going too deep (shoulder strain), flaring elbows, swinging."],
    ["جسم مفرود = تراي أكتر، ميل لقدام = صدر أكتر.", "Upright torso = more triceps; forward lean = more chest."],
  ),
  "تراي/ديبس على البنش": c(
    ["ديبس على البنش، نسخة سهلة من الديبس للمبتدئين.", "Bench dips, an easier dip variation for beginners."],
    [
      "1. اسند إيديك على طرف البنش ورجلك قدامك.\n2. انزل بثني الكوع لحد 90 درجة.\n3. ادفع لفوق.\n4. ضهرك قريب من البنش.",
      "1. Hands on the bench edge, legs out in front.\n2. Lower by bending the elbows to 90°.\n3. Push back up.\n4. Keep your back close to the bench.",
    ],
    ["النزول عميق زيادة، الضهر بعيد عن البنش، الكوع يفتح.", "Dipping too deep, drifting away from the bench, flaring elbows."],
    ["رجل مثنية = أسهل، رجل مفرودة = أصعب.", "Bent knees = easier; straight legs = harder."],
  ),
  "تراي/ديبس بالماكينة": c(
    ["ديبس على الماكينة، بيعزل التراي بوزن متحكم فيه.", "Machine dips, isolating the triceps with controlled load."],
    [
      "1. اقعد واظبط الكرسي وامسك المقابض جنبك.\n2. ادفع المقابض لتحت لحد ما الدراع يتفرد.\n3. اعصر التراي.\n4. ارجع ببطء.",
      "1. Sit, adjust the seat and grab the handles at your sides.\n2. Push the handles down until your arms are straight.\n3. Squeeze the triceps.\n4. Return slowly.",
    ],
    ["رفع الكتف، الميل لقدام، رجوع سريع.", "Shrugging, leaning forward, fast return."],
    ["مناسبة للي لسه مش قادر يعمل ديبس بوزن الجسم.", "Good for anyone who can't do bodyweight dips yet."],
  ),
  "تراي/ضغط دايموند": c(
    ["ضغط دايموند والإيدين لازقين، بيركز على التراي.", "Diamond push-up with hands together, targeting the triceps."],
    [
      "1. حط إيديك تحت صدرك والصوابع عاملة شكل ماسة.\n2. جسمك مفرود.\n3. انزل لحد ما صدرك يقرب من إيدك.\n4. ادفع لفوق.",
      "1. Hands under your chest with fingers forming a diamond.\n2. Body in a straight line.\n3. Lower until your chest nears your hands.\n4. Push back up.",
    ],
    ["الوسط ينزل، الكوع يفتح لبره، النزول نص المسافة.", "Sagging hips, elbows flaring, half reps."],
    ["لو صعب اعمله على الركب.", "Too hard? Do it from your knees."],
  ),
  "تراي/ضغط قبضة ضيقة": c(
    ["ضغط بقبضة ضيقة والكوع لازق في الجسم، بيركز على التراي.", "Close-grip push-up with elbows tucked, emphasizing the triceps."],
    [
      "1. حط إيديك بعرض الكتف تحت صدرك.\n2. جسمك مفرود.\n3. انزل والكوع لازق في جنبك.\n4. ادفع لفوق.",
      "1. Hands shoulder-width under your chest.\n2. Body straight.\n3. Lower with elbows tucked to your sides.\n4. Push back up.",
    ],
    ["الكوع يفتح، الوسط ينزل، مدى قصير.", "Elbows flaring, sagging hips, short range."],
    ["الكوع لورا هو اللي بيخلي التراي يشتغل.", "Keeping elbows back is what loads the triceps."],
  ),

  // ───────────── كتف ─────────────
  "كتف/ضغط كتف بالبار واقف": c(
    ["ضغط كتف بالبار واقف (ميليتري برس)، أساسي لقوة وحجم الكتف.", "Standing barbell overhead press, a core lift for shoulder strength and size."],
    [
      "1. امسك البار على مستوى الكتف أوسع شوية من الكتف.\n2. شد البطن والمؤخرة.\n3. ادفع البار لفوق راسك لحد ما الدراع يتفرد.\n4. نزّله بتحكم لمستوى الكتف.",
      "1. Hold the bar at shoulder level, grip slightly wider than shoulders.\n2. Brace abs and glutes.\n3. Press overhead to straight arms.\n4. Lower under control to the shoulders.",
    ],
    ["تقويس أسفل الضهر، استخدام الرجل، البار قدام الوش بعيد.", "Arching the lower back, using leg drive, bar drifting forward."],
    ["حرك راسك لورا شوية علشان البار يعدي، وبعدين رجعها تحت البار.", "Move your head back slightly to clear the bar, then back under it."],
  ),
  "كتف/ضغط كتف بالبار جالس": c(
    ["ضغط كتف بالبار جالس، بيقلل الضغط على أسفل الضهر.", "Seated barbell shoulder press with less lower-back stress."],
    [
      "1. اقعد على بنش بمسند وامسك البار على مستوى الكتف.\n2. ضهرك لازق في المسند.\n3. ادفع لفوق.\n4. نزّل لمستوى الدقن أو الكتف.",
      "1. Sit on a bench with back support holding the bar at shoulder level.\n2. Back flat on the pad.\n3. Press overhead.\n4. Lower to chin/shoulder level.",
    ],
    ["تقويس الضهر بعيد عن المسند، النزول ورا الرقبة، قفل الكوع بعنف.", "Arching off the pad, lowering behind the neck, slamming elbows locked."],
    ["استخدم الرف علشان تاخد البار بأمان.", "Use the rack to un-rack safely."],
  ),
  "كتف/ضغط كتف دمبل جالس": c(
    ["ضغط كتف بالدمبل جالس، بيبني الكتف الأمامي والجانبي.", "Seated dumbbell shoulder press for front and side delts."],
    [
      "1. اقعد على بنش بمسند والدمبلز على مستوى الكتف.\n2. ادفع لفوق لحد ما يقربوا من بعض.\n3. نزّل ببطء لمستوى الكتف.\n4. ضهرك لازق في المسند.",
      "1. Sit on a bench with back support, dumbbells at shoulder level.\n2. Press up until they nearly meet.\n3. Lower slowly to shoulder level.\n4. Keep your back on the pad.",
    ],
    ["تقويس الضهر، خبط الدمبلز فوق، النزول نص المسافة.", "Arching the back, clanking at the top, half reps."],
    ["الكوع قدام الجسم شوية أريح على الكتف.", "Elbows slightly in front of the body are easier on the shoulders."],
  ),
  "كتف/أرنولد برس": c(
    ["أرنولد برس، ضغط دمبل مع لف بيشغل كل أجزاء الكتف.", "Arnold press, a rotating dumbbell press that hits all three delt heads."],
    [
      "1. اقعد والدمبلز قدام صدرك والكفوف ناحيتك.\n2. ادفع لفوق وانت بتلف الكفوف لقدام.\n3. في الأعلى الكفوف لقدام والدراع مفرود.\n4. ارجع بنفس اللفة.",
      "1. Sit with dumbbells in front of your chest, palms facing you.\n2. Press up while rotating palms forward.\n3. Finish overhead, palms forward.\n4. Reverse the rotation on the way down.",
    ],
    ["اللف بسرعة، تقويس الضهر، وزن تقيل زيادة.", "Rotating too fast, arching, going too heavy."],
    ["حركة ناعمة ومتحكم فيها، والوزن أخف من الضغط العادي.", "Keep it smooth and controlled with less weight than a regular press."],
  ),
  "كتف/ضغط كتف بالماكينة": c(
    ["ضغط كتف على الماكينة، آمن ومناسب للمبتدئين.", "Machine shoulder press, safe and beginner-friendly."],
    [
      "1. اظبط الكرسي بحيث المقابض على مستوى الكتف.\n2. ضهرك لازق في المسند.\n3. ادفع لفوق من غير ما تقفل الكوع.\n4. ارجع ببطء.",
      "1. Set the seat so handles are at shoulder height.\n2. Back flat on the pad.\n3. Press up without locking the elbows.\n4. Return slowly.",
    ],
    ["الكرسي واطي أو عالي زيادة، رفع الكتف للودن، تقويس الضهر.", "Seat too low or high, shrugging, arching."],
    ["ممتاز لعدات عالية بعد الضغط بالبار أو الدمبل.", "Great for higher reps after barbell or dumbbell pressing."],
  ),
  "كتف/رفرفة جانبي بالدمبل": c(
    ["رفرفة جانبي بالدمبل، أهم تمرين لعرض الكتف.", "Dumbbell lateral raise, the key exercise for shoulder width."],
    [
      "1. اقف والدمبلز جنبك والكوع مثني شوية.\n2. ارفع الدمبلز لجنبك لحد مستوى الكتف.\n3. ثبت ثانية فوق.\n4. نزّل ببطء.",
      "1. Stand with dumbbells at your sides, slight bend in the elbows.\n2. Raise them out to the sides to shoulder height.\n3. Pause a second.\n4. Lower slowly.",
    ],
    ["المرجحة بالجسم، رفع الإيد أعلى من الكتف، رفع الكتف للودن.", "Swinging the body, lifting above shoulder height, shrugging."],
    ["تخيل إنك بتزق الدمبل لبره مش لفوق، ووزن خفيف وعدات كتير.", "Think 'push out' not 'lift up'; light weight, high reps."],
  ),
  "كتف/رفرفة جانبي على بنش مائل": c(
    ["رفرفة جانبي وانت نايم على جنبك على بنش مائل، شد أكبر في أول الحركة.", "Side-lying incline lateral raise with more tension at the start of the movement."],
    [
      "1. نام على جنبك على بنش مائل والدمبل في الإيد اللي فوق.\n2. ارفع الدمبل لفوق لحد ما الدراع يبقى عمودي تقريبًا.\n3. نزّل ببطء.\n4. كمّل وبدّل الجنب.",
      "1. Lie on your side on an incline bench, dumbbell in the top hand.\n2. Raise it until the arm is nearly vertical.\n3. Lower slowly.\n4. Finish, then switch sides.",
    ],
    ["المرجحة، لف الجسم، وزن تقيل.", "Swinging, rotating the torso, going too heavy."],
    ["وزن خفيف جدًا كفاية بسبب الزاوية.", "Very light weight is enough at this angle."],
  ),
  "كتف/رفرفة جانبي بالكابل": c(
    ["رفرفة جانبي بالكابل بدراع واحد، شد مستمر على الكتف الجانبي.", "Single-arm cable lateral raise with constant tension on the side delt."],
    [
      "1. اقف جنب الكابل والبكرة تحت وامسك المقبض بالإيد البعيدة.\n2. ارفع الدراع لجنبك لحد مستوى الكتف.\n3. ثبت ثانية.\n4. نزّل ببطء.",
      "1. Stand beside a low pulley, holding the handle with the far hand.\n2. Raise the arm out to shoulder height.\n3. Pause a second.\n4. Lower slowly.",
    ],
    ["الميل بالجسم، الرفع أعلى من الكتف، الرجوع بسرعة.", "Leaning away, lifting above shoulder height, fast return."],
    ["الكابل بيدي شد من أول الحركة أكتر من الدمبل.", "The cable loads the start of the movement better than dumbbells."],
  ),
  "كتف/رفرفة جانبي بالماكينة": c(
    ["رفرفة جانبي على الماكينة، عزل آمن للكتف الجانبي.", "Machine lateral raise, a safe side-delt isolation exercise."],
    [
      "1. اظبط الكرسي بحيث الكتف في نفس مستوى محور الماكينة.\n2. حط دراعك على المساند.\n3. ارفع لجنبك لحد مستوى الكتف.\n4. نزّل ببطء.",
      "1. Set the seat so your shoulders line up with the machine pivot.\n2. Place your arms on the pads.\n3. Raise out to shoulder height.\n4. Lower slowly.",
    ],
    ["رفع الكتف للودن، رجوع سريع، الكرسي مش مظبوط.", "Shrugging, fast return, wrong seat height."],
    ["ركز إن الكوع هو اللي بيرفع.", "Lead the movement with your elbows."],
  ),
  "كتف/رفرفة أمامي بالدمبل": c(
    ["رفرفة أمامي بالدمبل، عزل للكتف الأمامي.", "Dumbbell front raise to isolate the front delts."],
    [
      "1. اقف والدمبلز قدام فخدك.\n2. ارفع الدمبلز لقدام لحد مستوى الكتف والدراع شبه مفرود.\n3. ثبت ثانية.\n4. نزّل ببطء.",
      "1. Stand with dumbbells in front of your thighs.\n2. Raise them forward to shoulder height, arms nearly straight.\n3. Pause a second.\n4. Lower slowly.",
    ],
    ["المرجحة بالضهر، الرفع أعلى من الكتف، وزن تقيل.", "Swinging with the back, lifting too high, going too heavy."],
    ["الكتف الأمامي بيشتغل كتير في تمارين الصدر، فمش محتاج حجم كبير هنا.", "Front delts get plenty of work from pressing, so keep volume moderate."],
  ),
  "كتف/رفرفة أمامي بالكابل": c(
    ["رفرفة أمامي بالكابل، شد مستمر على الكتف الأمامي.", "Cable front raise with constant tension on the front delts."],
    [
      "1. اقف وضهرك للكابل والبكرة تحت وامسك المقبض.\n2. ارفع الدراع لقدام لحد مستوى الكتف.\n3. ثبت ثانية.\n4. نزّل ببطء.",
      "1. Stand with your back to a low pulley holding the handle.\n2. Raise the arm forward to shoulder height.\n3. Pause a second.\n4. Lower slowly.",
    ],
    ["الميل لورا، المرجحة، الرفع أعلى من الكتف.", "Leaning back, swinging, lifting too high."],
    ["خلي الجسم ثابت تمامًا.", "Keep your body completely still."],
  ),
  "كتف/رفرفة خلفي بالدمبل واقف": c(
    ["رفرفة خلفي بالدمبل وانت منحني واقف، للكتف الخلفي.", "Standing bent-over rear delt fly for the rear delts."],
    [
      "1. انحني من الحوض والضهر مفرود والدمبلز تحتك.\n2. الكوع مثني شوية.\n3. ارفع الدمبلز لجنبك لحد مستوى الكتف.\n4. نزّل ببطء.",
      "1. Hinge at the hips, back flat, dumbbells below you.\n2. Soft bend in the elbows.\n3. Raise them out to shoulder height.\n4. Lower slowly.",
    ],
    ["تقويس الضهر، قرب لوح الكتف زيادة فيشتغل الضهر، المرجحة.", "Rounding the back, over-squeezing the shoulder blades (back takes over), swinging."],
    ["وزن خفيف وعدات 12-20.", "Light weight, 12–20 reps."],
  ),
  "كتف/رفرفة خلفي على بنش مائل": c(
    ["رفرفة خلفي وصدرك على بنش مائل، بيمنع الغش ويعزل الكتف الخلفي.", "Chest-supported incline rear delt fly that removes cheating."],
    [
      "1. نام بصدرك على بنش مائل والدمبلز متعلقين.\n2. ارفع الدمبلز لجنبك والكوع مثني شوية.\n3. ثبت ثانية فوق.\n4. نزّل ببطء.",
      "1. Lie chest-down on an incline bench with dumbbells hanging.\n2. Raise them out to the sides with soft elbows.\n3. Pause at the top.\n4. Lower slowly.",
    ],
    ["رفع الصدر من على البنش، وزن تقيل، رفع الكتف للودن.", "Lifting the chest off the pad, going heavy, shrugging."],
    ["من أنضف الطرق لتمرين الكتف الخلفي.", "One of the cleanest ways to train the rear delts."],
  ),
  "كتف/رفرفة خلفي بالكابل": c(
    ["رفرفة خلفي بالكابل كروس، شد مستمر على الكتف الخلفي.", "Cable rear delt fly with constant tension."],
    [
      "1. حط البكرتين على مستوى الكتف وامسك كل كابل بالإيد العكسية.\n2. افتح دراعاتك لبره ولورا والكوع مثني شوية.\n3. ثبت ثانية.\n4. ارجع ببطء.",
      "1. Set both pulleys at shoulder height and cross the cables, each hand holding the opposite side.\n2. Pull your arms out and back with soft elbows.\n3. Pause a second.\n4. Return slowly.",
    ],
    ["الشد بالضهر، الميل لورا، رجوع سريع.", "Pulling with the back, leaning back, fast return."],
    ["ممكن تمسك الكابل نفسه من غير مقابض.", "You can hold the cable ends directly without handles."],
  ),
  "كتف/رفرفة خلفي بالماكينة": c(
    ["رفرفة خلفي على ماكينة البيك ديك (ريفرس فلاي)، عزل آمن للكتف الخلفي.", "Reverse pec deck, a safe rear-delt isolation exercise."],
    [
      "1. اقعد ووشك للماكينة وصدرك على المسند.\n2. امسك المقابض قدامك والدراع مفرود.\n3. افتح دراعاتك لورا لحد مستوى الجسم.\n4. ارجع ببطء.",
      "1. Sit facing the machine, chest on the pad.\n2. Hold the handles in front with arms straight.\n3. Open your arms back to body level.\n4. Return slowly.",
    ],
    ["رفع الكتف، الشد بالضهر، الرجوع بسرعة.", "Shrugging, pulling with the back, fast return."],
    ["ثبت ثانية في الآخر لانقباض أفضل.", "Pause at the end for a better contraction."],
  ),
  "كتف/فيس بول": c(
    ["فيس بول بالكابل، للكتف الخلفي والعضلات الصغيرة حوالين الكتف وتحسين القوام.", "Cable face pull for rear delts, rotator cuff and posture."],
    [
      "1. حط البكرة على مستوى الوش وركب الحبل.\n2. امسك الحبل والكفوف لتحت وارجع خطوة.\n3. اسحب الحبل ناحية وشك وافتح إيديك لبره والكوع عالي.\n4. ارجع ببطء.",
      "1. Set the pulley at face height with a rope.\n2. Grab the rope palms-down and step back.\n3. Pull toward your face, spreading your hands apart with elbows high.\n4. Return slowly.",
    ],
    ["الكوع واطي، الشد بوزن الجسم، وزن تقيل زيادة.", "Elbows too low, yanking with body weight, too heavy."],
    ["تمرين ممتاز لصحة الكتف — اعمله بانتظام.", "Excellent for shoulder health — do it regularly."],
  ),
  "كتف/سحب عالي بالبار": c(
    ["سحب عالي بالبار (أبرايت رو)، للكتف الجانبي والترابيس.", "Barbell upright row for side delts and traps."],
    [
      "1. اقف وامسك البار قدامك بعرض الكتف أو أوسع.\n2. اسحب البار لفوق قريب من جسمك والكوع يسبق.\n3. وقّف لما الكوع يوصل مستوى الكتف.\n4. نزّل ببطء.",
      "1. Stand holding the bar in front, shoulder-width or wider.\n2. Pull it up close to your body, elbows leading.\n3. Stop when elbows reach shoulder height.\n4. Lower slowly.",
    ],
    ["قبضة ضيقة زيادة، الرفع أعلى من الكتف، المرجحة.", "Grip too narrow, pulling too high, swinging."],
    ["القبضة الواسعة أأمن على الكتف.", "A wider grip is safer for the shoulders."],
  ),
  "كتف/سحب عالي بالكابل": c(
    ["سحب عالي بالكابل، شد مستمر على الكتف الجانبي.", "Cable upright row with constant tension on the side delts."],
    [
      "1. حط البكرة تحت وركب بار مستقيم.\n2. امسك البار واقف مفرود.\n3. اسحب لفوق والكوع يسبق لحد مستوى الكتف.\n4. نزّل ببطء.",
      "1. Set the pulley low with a straight bar.\n2. Hold the bar standing tall.\n3. Pull up, elbows leading, to shoulder height.\n4. Lower slowly.",
    ],
    ["الرفع أعلى من الكتف، الميل لورا، قبضة ضيقة.", "Pulling too high, leaning back, narrow grip."],
    ["خلي البار قريب من جسمك طول الحركة.", "Keep the bar close to your body throughout."],
  ),
  "كتف/بايك بوش اب": c(
    ["بايك بوش اب، ضغط كتف بوزن الجسم.", "Pike push-up, a bodyweight shoulder press."],
    [
      "1. اعمل وضع الضغط وارفع الحوض لفوق لحد ما جسمك يبقى زي حرف V مقلوب.\n2. انزل براسك ناحية الأرض بين إيديك.\n3. ادفع لفوق.\n4. الرجل مفرودة قد ما تقدر.",
      "1. From a push-up position, raise your hips into an inverted V.\n2. Lower your head toward the floor between your hands.\n3. Press back up.\n4. Keep your legs as straight as you can.",
    ],
    ["الحوض ينزل فيتحول لضغط عادي، الكوع يفتح، النزول نص المسافة.", "Hips dropping (turns into a regular push-up), elbows flaring, half reps."],
    ["كل ما الرجل تبقى أعلى (على بنش) كل ما التمرين أصعب.", "Elevating your feet on a bench makes it harder."],
  ),
  "كتف/ضغط وقوف على الإيدين على الحائط": c(
    ["ضغط وانت واقف على إيدك والرجل على الحائط، تمرين متقدم للكتف.", "Wall handstand push-up, an advanced bodyweight shoulder exercise."],
    [
      "1. اقف على إيدك والرجل مسنودة على الحائط.\n2. انزل براسك بتحكم ناحية الأرض.\n3. ادفع لفوق لحد ما الدراع يتفرد.\n4. البطن مشدودة طول الحركة.",
      "1. Kick up into a handstand with feet against the wall.\n2. Lower your head under control toward the floor.\n3. Press back up to straight arms.\n4. Keep your core tight throughout.",
    ],
    ["النزول بسرعة، تقويس الضهر، الكوع يفتح.", "Dropping fast, arching the back, flaring elbows."],
    ["ابدأ بالبايك بوش اب الأول، وحط مخدة تحت راسك.", "Master pike push-ups first, and put a cushion under your head."],
  ),

  // ───────────── ظهر ─────────────
  "ظهر/عقلة واسعة": c(
    ["عقلة بقبضة واسعة، بتركز على عرض الضهر.", "Wide-grip pull-up focusing on back width."],
    [
      "1. امسك البار أوسع من الكتف بكتير والكفوف لقدام.\n2. اتعلق والدراع مفرود.\n3. اسحب نفسك لفوق لحد ما الدقن تعدي البار.\n4. انزل ببطء.",
      "1. Grip the bar well wider than shoulders, palms forward.\n2. Hang with straight arms.\n3. Pull up until your chin clears the bar.\n4. Lower slowly.",
    ],
    ["المرجحة، النزول نص المسافة، رفع الكتف للودن.", "Swinging, half reps, shrugging."],
    ["أصعب من العقلة العادية، فابدأ بعدد قليل وعدات نضيفة.", "Harder than a regular pull-up — start with fewer, clean reps."],
  ),
  "ظهر/عقلة قبضة ضيقة": c(
    ["عقلة بقبضة ضيقة، بتشغل الضهر والباي.", "Close-grip pull-up working the back and biceps."],
    [
      "1. امسك البار والإيدين قريبين من بعض.\n2. اتعلق والدراع مفرود.\n3. اسحب لفوق لحد ما صدرك يقرب من البار.\n4. انزل ببطء.",
      "1. Grip the bar with hands close together.\n2. Hang with straight arms.\n3. Pull up until your chest nears the bar.\n4. Lower slowly.",
    ],
    ["المرجحة، النزول نص المسافة، شد الراس لقدام.", "Swinging, half reps, reaching with the chin."],
    ["القبضة الضيقة بتسمح بعدات أكتر من الواسعة.", "The close grip usually allows more reps than wide."],
  ),
  "ظهر/عقلة قبضة عكسية": c(
    ["عقلة بقبضة عكسية (تشين أب)، بتشغل الضهر والباي بقوة.", "Chin-up (underhand grip), working the back and biceps hard."],
    [
      "1. امسك البار بعرض الكتف والكفوف ناحيتك.\n2. اتعلق والدراع مفرود.\n3. اسحب لفوق لحد ما الدقن تعدي البار.\n4. انزل ببطء.",
      "1. Grip the bar shoulder-width, palms facing you.\n2. Hang with straight arms.\n3. Pull up until your chin clears the bar.\n4. Lower slowly.",
    ],
    ["المرجحة، النزول نص المسافة، رفع الكتف للودن.", "Swinging, half reps, shrugging."],
    ["عادة أسهل من العقلة العادية، فهي بداية كويسة.", "Usually easier than a pull-up — a good starting point."],
  ),
  "ظهر/تجديف بالحلقات": c(
    ["تجديف بوزن الجسم على الحلقات، بيقوي الضهر والثبات.", "Bodyweight ring row for back strength and stability."],
    [
      "1. امسك الحلقات وارجع بجسمك لورا مفرود والرجل على الأرض.\n2. اسحب صدرك ناحية الحلقات.\n3. قرب لوح الكتف من بعض.\n4. انزل ببطء.",
      "1. Hold the rings and lean back with a straight body, feet on the floor.\n2. Pull your chest to the rings.\n3. Squeeze the shoulder blades.\n4. Lower slowly.",
    ],
    ["الوسط ينزل، الشد بالدراع بس، مدى قصير.", "Sagging hips, arm-only pulling, short range."],
    ["مشّي رجلك لقدام علشان تصعّب التمرين.", "Walk your feet forward to make it harder."],
  ),
  "ظهر/تجديف معكوس تحت الترابيزة": c(
    ["تجديف بوزن الجسم تحت ترابيزة، بديل للتمرين في البيت.", "Bodyweight row under a sturdy table — a home-workout option."],
    [
      "1. نام تحت ترابيزة تقيلة وثابتة وامسك طرفها.\n2. جسمك مفرود والكعب على الأرض.\n3. اسحب صدرك ناحية الترابيزة.\n4. انزل ببطء.",
      "1. Lie under a heavy, stable table and grip its edge.\n2. Body straight, heels on the floor.\n3. Pull your chest toward the table.\n4. Lower slowly.",
    ],
    ["ترابيزة مش ثابتة، الوسط ينزل، مدى قصير.", "An unstable table, sagging hips, short range."],
    ["اتأكد إن الترابيزة تقيلة كفاية ومش هتتقلب.", "Make sure the table is heavy enough not to tip."],
  ),
  "ظهر/تجديف بالفوطة على الباب": c(
    ["تجديف بفوطة مربوطة في مقبض الباب، تمرين ضهر في البيت.", "Towel row anchored on a door handle — a home back exercise."],
    [
      "1. لف فوطة حوالين مقبض باب مقفول كويس وامسك الطرفين.\n2. ارجع بجسمك لورا والرجل قريبة من الباب.\n3. اسحب جسمك ناحية الباب.\n4. ارجع ببطء.",
      "1. Loop a towel around the handle of a securely closed door and hold both ends.\n2. Lean back with feet near the door.\n3. Pull yourself toward the door.\n4. Return slowly.",
    ],
    ["الباب مش مقفول كويس، تقويس الضهر، الشد بالدراع بس.", "Door not secured, rounding the back, arm-only pulling."],
    ["اتأكد إن الباب مقفول ومش هيتفتح ناحيتك.", "Make sure the door is shut and won't swing toward you."],
  ),
  "ظهر/سوبرمان": c(
    ["سوبرمان، بيقوي أسفل الضهر والمؤخرة بوزن الجسم.", "Superman, a bodyweight lower-back and glute strengthener."],
    [
      "1. نام على بطنك والدراع مفرود قدامك.\n2. ارفع دراعاتك ورجلك وصدرك من على الأرض في نفس الوقت.\n3. اثبت 2-3 ثواني.\n4. انزل ببطء.",
      "1. Lie face-down with arms extended forward.\n2. Lift arms, chest and legs off the floor together.\n3. Hold 2–3 seconds.\n4. Lower slowly.",
    ],
    ["رفع الراس لفوق زيادة، الحركة بسرعة، ثني الركبة.", "Cranking the neck up, rushing, bending the knees."],
    ["بصّ للأرض علشان رقبتك تفضل في وضع مريح.", "Look at the floor to keep your neck neutral."],
  ),
  "ظهر/هايبر اكستنشن": c(
    ["هايبر اكستنشن، بيقوي أسفل الضهر والمؤخرة والخلفية.", "Back hyperextension for the lower back, glutes and hamstrings."],
    [
      "1. اظبط الجهاز بحيث الحوض على حافة المسند والرجل مثبتة.\n2. ربّع دراعاتك على صدرك وانزل لقدام.\n3. اطلع لحد ما جسمك يبقى في خط مستقيم.\n4. ماتطلعش أعلى من كده.",
      "1. Set the pad so your hips sit at its edge with feet anchored.\n2. Cross your arms on your chest and lower forward.\n3. Rise until your body forms a straight line.\n4. Don't go past straight.",
    ],
    ["تقويس الضهر لورا زيادة في الأعلى، الحركة بسرعة، المسند عالي زيادة.", "Hyperextending past straight, rushing, pad set too high."],
    ["امسك طارة على صدرك لما يبقى سهل.", "Hold a plate on your chest once it gets easy."],
  ),

  // ───────────── مؤخرة ─────────────
  "مؤخرة/هيب ثرست بالبار": c(
    ["هيب ثرست بالبار، من أقوى تمارين بناء المؤخرة.", "Barbell hip thrust, one of the best glute builders."],
    [
      "1. اسند أعلى ضهرك على بنش والبار على الحوض (حط مخدة).\n2. الرجل على الأرض بعرض الحوض.\n3. ادفع الحوض لفوق لحد ما جسمك يبقى مستقيم من الكتف للركبة.\n4. اعصر المؤخرة ثانية ونزّل ببطء.",
      "1. Rest your upper back on a bench with the bar over your hips (use a pad).\n2. Feet flat, hip-width.\n3. Drive hips up until shoulders to knees form a straight line.\n4. Squeeze the glutes a second, then lower slowly.",
    ],
    ["تقويس أسفل الضهر في الأعلى، الدفع بالصوابع، الرجل بعيدة زيادة.", "Arching the lower back at the top, pushing through the toes, feet too far out."],
    ["الدقن لتحت والدفع من الكعب.", "Keep your chin tucked and drive through your heels."],
  ),
  "مؤخرة/جلوت بريدج": c(
    ["جلوت بريدج، تمرين مؤخرة بوزن الجسم مناسب للمبتدئين.", "Glute bridge, a beginner-friendly bodyweight glute exercise."],
    [
      "1. نام على ضهرك والركبة مثنية والرجل على الأرض.\n2. ادفع الحوض لفوق لحد ما جسمك يبقى مستقيم من الكتف للركبة.\n3. اعصر المؤخرة ثانيتين.\n4. نزّل ببطء.",
      "1. Lie on your back, knees bent, feet flat.\n2. Lift your hips until shoulders to knees form a straight line.\n3. Squeeze the glutes for two seconds.\n4. Lower slowly.",
    ],
    ["تقويس الضهر بدل استخدام المؤخرة، الدفع بالصوابع.", "Arching the back instead of using the glutes, pushing through the toes."],
    ["حط أستك فوق الركبة أو اعمله برجل واحدة لزيادة الصعوبة.", "Add a band above the knees or go single-leg to progress."],
  ),
  "مؤخرة/فتح الفخد بالماكينة": c(
    ["فتح الفخد على الماكينة (أبدكشن)، بيشغل جانب المؤخرة.", "Machine hip abduction for the side glutes."],
    [
      "1. اقعد والمساند على الجزء الخارجي من الركبة.\n2. افتح رجلك لبره لآخر مدى.\n3. ثبت ثانية.\n4. ارجع ببطء.",
      "1. Sit with the pads on the outside of your knees.\n2. Push your legs apart as far as you can.\n3. Pause a second.\n4. Return slowly.",
    ],
    ["الرجوع بسرعة، استخدام الإيد، وزن تقيل يقصر المدى.", "Snapping back, pushing with your hands, too much weight shortening the range."],
    ["ميل لقدام شوية بيزود التركيز على المؤخرة.", "Leaning slightly forward puts more emphasis on the glutes."],
  ),
  "مؤخرة/ركلة خلفية بالكابل": c(
    ["ركلة خلفية بالكابل، عزل للمؤخرة بشد مستمر.", "Cable glute kickback, glute isolation with constant tension."],
    [
      "1. اربط الكابل في الكاحل والبكرة تحت، وامسك الماكينة.\n2. ارفع الرجل لورا والركبة مفرودة شوية.\n3. اعصر المؤخرة في الأعلى.\n4. ارجع ببطء.",
      "1. Attach the cable to your ankle with the pulley low; hold the machine.\n2. Kick the leg back with a soft knee.\n3. Squeeze the glute at the top.\n4. Return slowly.",
    ],
    ["تقويس أسفل الضهر، لف الحوض، المرجحة.", "Arching the lower back, rotating the hips, swinging."],
    ["الحركة صغيرة ومتحكم فيها أحسن من مدى كبير بالضهر.", "A small, controlled range beats a big range driven by the back."],
  ),
  "مؤخرة/رفع رجل جانبي نايم": c(
    ["رفع رجل جانبي وانت نايم على جنبك، لجانب المؤخرة.", "Side-lying leg raise for the side glutes."],
    [
      "1. نام على جنبك والرجلين مفرودين فوق بعض.\n2. ارفع الرجل اللي فوق لفوق.\n3. ثبت ثانية.\n4. نزّل ببطء، وبدّل.",
      "1. Lie on your side with legs straight and stacked.\n2. Raise the top leg.\n3. Pause a second.\n4. Lower slowly, then switch.",
    ],
    ["لف الحوض لورا، الصوابع لفوق، الحركة بسرعة.", "Rolling the hips back, toes pointing up, rushing."],
    ["خلي صوابع رجلك لقدام أو لتحت شوية.", "Keep your toes pointing forward or slightly down."],
  ),
  "مؤخرة/مشي جانبي بالأستك": c(
    ["مشي جانبي بالأستك، بيقوي جانب المؤخرة وثبات الركبة.", "Banded lateral walk for side-glute strength and knee stability."],
    [
      "1. حط الأستك فوق الكاحل أو الركبة.\n2. انزل في وضع نص سكوات.\n3. امشي خطوات جانبية والأستك مشدود طول الوقت.\n4. كمّل العدد وارجع للجهة التانية.",
      "1. Place the band around your ankles or above the knees.\n2. Sit into a half squat.\n3. Take side steps, keeping tension on the band.\n4. Complete the steps, then go the other way.",
    ],
    ["الوقوف مفرود، الرجلين يقربوا من بعض، الركبة تدخل.", "Standing up tall, letting feet come together, knees caving."],
    ["ممتاز كإحماء قبل تمارين الرجل.", "Great as a warm-up before leg training."],
  ),

  // ───────────── رجل ─────────────
  "رجل أمامية/بلغاري سبليت سكوات بالدمبل": c(
    ["بلغاري سبليت سكوات بالدمبل، تمرين رجل فردي قوي للأمامية والمؤخرة.", "Dumbbell Bulgarian split squat, a strong single-leg move for quads and glutes."],
    [
      "1. امسك دمبلز جنبك وحط رجلك الخلفية على البنش.\n2. انزل لحد ما الفخد القدامي يوازي الأرض.\n3. خلي الوزن على الرجل القدامية.\n4. ادفع واطلع، وبدّل.",
      "1. Hold dumbbells at your sides with the rear foot on a bench.\n2. Lower until the front thigh is parallel.\n3. Keep weight on the front leg.\n4. Drive up, then switch.",
    ],
    ["الرجل القدامية قريبة من البنش، الركبة تدخل، الوزن على الرجل الخلفية.", "Front foot too close, knee caving, weight on the back leg."],
    ["أتقنه بوزن الجسم الأول قبل الدمبل.", "Master it bodyweight first before adding dumbbells."],
  ),
  "رجل أمامية/ضم الفخد بالماكينة": c(
    ["ضم الفخد على الماكينة (أدكشن)، للعضلة الداخلية للفخد.", "Machine hip adduction for the inner thighs."],
    [
      "1. اقعد والمساند على الجزء الداخلي من الركبة والرجل مفتوحة.\n2. ضم رجلك لجوه.\n3. ثبت ثانية.\n4. افتح ببطء.",
      "1. Sit with the pads on the inside of your knees, legs apart.\n2. Squeeze your legs together.\n3. Pause a second.\n4. Open slowly.",
    ],
    ["فتح الرجل زيادة عن المريح، الرجوع بسرعة، وزن تقيل.", "Opening wider than comfortable, snapping back, too heavy."],
    ["ابدأ بمدى مريح وزوّده تدريجيًا.", "Start with a comfortable range and increase gradually."],
  ),
  "رجل خلفية/جود مورنينج بالبار": c(
    ["جود مورنينج بالبار، بيقوي الخلفية وأسفل الضهر والمؤخرة.", "Barbell good morning for hamstrings, lower back and glutes."],
    [
      "1. حط البار على أعلى الضهر زي السكوات والركبة مثنية شوية.\n2. ارجع بالحوض لورا وميّل لقدام والضهر مفرود.\n3. انزل لحد ما تحس بمط في الخلفية.\n4. ادفع الحوض لقدام وارجع وقف.",
      "1. Bar on your upper back as for a squat, knees soft.\n2. Push your hips back and hinge forward with a flat back.\n3. Lower until you feel a hamstring stretch.\n4. Drive the hips forward to stand.",
    ],
    ["تقويس الضهر، وزن تقيل زيادة، ثني الركبة زيادة.", "Rounding the back, going too heavy, bending the knees too much."],
    ["ابدأ بالبار فاضي أو عصاية لحد ما تتقن الحركة.", "Start with an empty bar or a stick until the pattern is solid."],
  ),
  "رجل خلفية/رومانيان ديدلفت بالبار 2": c(
    ["نسخة تانية من الرومانيان ديدلفت بالبار للخلفية والمؤخرة.", "A barbell Romanian deadlift variation for hamstrings and glutes."],
    [
      "1. اقف والبار قدام فخدك والركبة مثنية شوية.\n2. ارجع بالحوض لورا والبار ينزل قريب من رجلك.\n3. انزل لحد المط في الخلفية.\n4. ادفع الحوض لقدام وقف.",
      "1. Stand with the bar at your thighs, knees soft.\n2. Push your hips back, sliding the bar down your legs.\n3. Lower to a hamstring stretch.\n4. Drive the hips forward to stand.",
    ],
    ["تقويس الضهر، البار بعيد عن الرجل، ثني الركبة زيادة.", "Rounding the back, bar drifting away, bending the knees too much."],
    ["الحركة من الحوض مش من الضهر.", "Move from the hips, not the back."],
  ),
};
