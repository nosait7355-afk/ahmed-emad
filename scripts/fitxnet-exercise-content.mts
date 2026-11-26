/**
 * Description / instructions / common mistakes / coach tips (AR + EN) for the
 * Fitxnet exercises, keyed by externalId ("<muscle folder>/<Arabic name>").
 * Applied by scripts/apply-fitxnet-content.mts.
 */
type L = { ar: string; en: string };
export type Content = { d: L; i: L; m: L; t: L };

const c = (d: [string, string], i: [string, string], m: [string, string], t: [string, string]): Content => ({
  d: { ar: d[0], en: d[1] },
  i: { ar: i[0], en: i[1] },
  m: { ar: m[0], en: m[1] },
  t: { ar: t[0], en: t[1] },
});

const pushUp = (extraAr: string, extraEn: string) =>
  c(
    [`تمرين ضغط بوزن الجسم يقوي الصدر والكتف الأمامي والترايسبس. ${extraAr}`, `Bodyweight push-up that builds the chest, front delts and triceps. ${extraEn}`],
    [
      "1. اسند إيديك على الأرض أوسع شوية من الكتف وجسمك مفرود في خط واحد.\n2. انزل بصدرك لتحت لحد ما يقرب من الأرض والكوع بزاوية حوالي 45 درجة.\n3. ادفع الأرض واطلع لفوق لحد ما دراعك يتفرد.\n4. خلي البطن والمؤخرة مشدودين طول الحركة.",
      "1. Hands on the floor slightly wider than shoulders, body in a straight line.\n2. Lower your chest toward the floor, elbows about 45° from the body.\n3. Push the floor away until your arms are straight.\n4. Keep abs and glutes tight throughout.",
    ],
    ["الوسط ينزل لتحت أو المؤخرة تطلع لفوق، فتح الكوع على الجنب 90 درجة، النزول نص المسافة.", "Sagging hips or piked butt, flaring elbows to 90°, half reps."],
    ["لو صعب عليك ابدأ من على الركب أو بإيدك على بنش، وزوّد العدات قبل ما تصعّب التمرين.", "Too hard? Start on your knees or hands on a bench, and add reps before progressing."],
  );

export const CONTENT: Record<string, Content> = {
  // ───────────── صدر ─────────────
  "صدر/بنش برس مستوي بالبار": c(
    ["التمرين الأساسي لبناء قوة وحجم الصدر، ويشغل الكتف الأمامي والترايسبس.", "The main compound lift for chest strength and size, also working front delts and triceps."],
    [
      "1. نام على البنش وعينك تحت البار، ورجلك ثابتة على الأرض.\n2. امسك البار أوسع شوية من الكتف وشد لوح الكتف لورا وتحت.\n3. نزّل البار بتحكم لحد منتصف الصدر.\n4. ادفع البار لفوق لحد ما الدراع يتفرد من غير ما تقفل الكوع بعنف.",
      "1. Lie on the bench with eyes under the bar, feet planted.\n2. Grip slightly wider than shoulders, pull shoulder blades back and down.\n3. Lower the bar under control to mid-chest.\n4. Press up until arms are straight without slamming the elbows.",
    ],
    ["خبط البار في الصدر، رفع المؤخرة من على البنش، فتح الكوع 90 درجة، رسغ مكسور لورا.", "Bouncing the bar off the chest, lifting the hips, elbows flared to 90°, bent-back wrists."],
    ["استخدم سبوتر في الأوزان التقيلة، وخلي الكوع حوالي 45-70 درجة من الجسم لحماية الكتف.", "Use a spotter on heavy sets and keep elbows ~45–70° from your torso to protect the shoulders."],
  ),
  "صدر/بنش برس عالي بالبار": c(
    ["بنش برس على بنش مائل لفوق بيركز على الجزء العلوي من الصدر.", "Bench press on an incline bench that emphasizes the upper chest."],
    [
      "1. اظبط البنش على زاوية 30-45 درجة.\n2. امسك البار أوسع شوية من الكتف وشد لوح الكتف لورا.\n3. نزّل البار لأعلى الصدر تحت الترقوة.\n4. ادفع لفوق في خط مستقيم.",
      "1. Set the bench to 30–45°.\n2. Grip slightly wider than shoulders, retract shoulder blades.\n3. Lower the bar to the upper chest just below the collarbones.\n4. Press straight up.",
    ],
    ["زاوية البنش عالية زيادة فيتحول لتمرين كتف، نزول البار على البطن، رفع الوسط.", "Bench angle too steep (turns into a shoulder press), lowering to the belly, arching off the bench."],
    ["زاوية 30 درجة كفاية جدًا لاستهداف الصدر العلوي، واستخدم وزن أقل من المستوي.", "30° is plenty for upper chest; expect to use less weight than flat bench."],
  ),
  "صدر/ضغط دمبل عالي": c(
    ["ضغط دمبل على بنش مائل للصدر العلوي، بيدي مدى حركة أكبر من البار.", "Incline dumbbell press for the upper chest with a bigger range of motion than the barbell."],
    [
      "1. اقعد على بنش مائل 30-45 درجة والدمبلز على رجلك، وارجع بيهم لورا.\n2. ابدأ والدمبلز جنب الصدر العلوي والكوع تحت الإيد.\n3. ادفع لفوق لحد ما الدمبلز يقربوا من بعض.\n4. انزل ببطء لنفس نقطة البداية.",
      "1. Sit on a 30–45° bench with dumbbells on your thighs, then lie back.\n2. Start with dumbbells beside the upper chest, elbows under wrists.\n3. Press up until the dumbbells nearly meet.\n4. Lower slowly to the start.",
    ],
    ["خبط الدمبلز في بعض فوق، النزول بسرعة، فتح الكوع زيادة.", "Clanking the dumbbells at the top, dropping too fast, excessive elbow flare."],
    ["ركز إنك تعصر الصدر وانت طالع، واستخدم رجلك علشان تطلع الدمبلز لمكان البداية بأمان.", "Squeeze the chest on the way up, and kick the dumbbells up with your knees to get into position safely."],
  ),
  "صدر/ضغط دمبل مستوي بقبضة ضيقة": c(
    ["ضغط دمبل والدمبلز لازقين في بعض، بيركز على منتصف الصدر والترايسبس.", "Squeeze/close-grip dumbbell press targeting the inner chest and triceps."],
    [
      "1. نام على بنش مستوي وامسك الدمبلز فوق صدرك وكفوفك قصاد بعض.\n2. اضغط الدمبلز على بعض طول الحركة.\n3. نزّلهم لحد ما يلمسوا منتصف الصدر والكوع لازق في الجسم.\n4. ادفع لفوق وانت لسه ضاغطهم على بعض.",
      "1. Lie on a flat bench, dumbbells over your chest with palms facing each other.\n2. Press the dumbbells together the whole time.\n3. Lower to mid-chest, elbows close to your body.\n4. Press back up while keeping them squeezed together.",
    ],
    ["إن الدمبلز يبعدوا عن بعض، فتح الكوع، استخدام وزن تقيل يبوظ الحركة.", "Letting the dumbbells drift apart, flaring elbows, going too heavy."],
    ["وزن متوسط مع ضغط مستمر أحسن من وزن تقيل، وده تمرين ممتاز في آخر تمرين الصدر.", "Moderate weight with constant squeeze beats heavy weight; great as a chest finisher."],
  ),
  "صدر/تفتيح دمبل مستوي": c(
    ["تمرين عزل للصدر بيركز على مط وانقباض عضلة الصدر.", "Chest isolation move focusing on stretch and contraction of the pecs."],
    [
      "1. نام على بنش مستوي والدمبلز فوق صدرك والكوع مثني شوية.\n2. افتح دراعاتك لبره في قوس واسع لحد ما تحس بمط في الصدر.\n3. ارجع بنفس القوس لفوق كأنك بتحضن شجرة.\n4. ثبت انحناء الكوع طول الحركة.",
      "1. Lie on a flat bench, dumbbells above your chest, elbows slightly bent.\n2. Open your arms in a wide arc until you feel a stretch in the chest.\n3. Return along the same arc as if hugging a tree.\n4. Keep the elbow bend fixed throughout.",
    ],
    ["فرد الكوع خالص، النزول تحت مستوى الكتف زيادة، تحويلها لحركة ضغط.", "Locking the elbows straight, dropping too deep below shoulder level, turning it into a press."],
    ["استخدم وزن خفيف، الهدف هو المط والإحساس بالعضلة مش الوزن.", "Go light — the goal is the stretch and mind-muscle connection, not load."],
  ),
  "صدر/بيك ديك": c(
    ["تفتيح صدر على ماكينة البيك ديك لعزل عضلة الصدر بأمان.", "Pec deck machine fly that safely isolates the chest."],
    [
      "1. اظبط الكرسي بحيث المقابض في مستوى الصدر.\n2. اقعد وضهرك لازق في المسند وامسك المقابض.\n3. قرّب دراعاتك من بعض قدامك واعصر الصدر ثانية.\n4. ارجع ببطء لحد ما تحس بمط خفيف.",
      "1. Adjust the seat so handles are at chest height.\n2. Sit with your back against the pad and grab the handles.\n3. Bring your arms together in front and squeeze the chest for a second.\n4. Return slowly until you feel a light stretch.",
    ],
    ["الكرسي عالي أو واطي زيادة، رفع الكتف لفوق، ترك الوزن يرجع بسرعة.", "Seat too high or low, shrugging the shoulders, letting the weight snap back."],
    ["ثبت ثانية في الانقباض وخلي الرجوع أبطأ من الدفع.", "Hold the squeeze for a second and make the return slower than the push."],
  ),
  "صدر/تفتيح صدر بالماكينة": c(
    ["تفتيح صدر على الماكينة بمقابض، تمرين عزل للصدر.", "Machine chest fly with handles, a chest isolation exercise."],
    [
      "1. اظبط ارتفاع الكرسي والمقابض في مستوى الصدر.\n2. ضهرك لازق في المسند والكوع مثني شوية.\n3. قرّب المقابض من بعض قدامك واعصر الصدر.\n4. ارجع ببطء لحد المط.",
      "1. Set the seat so handles are at chest level.\n2. Back flat on the pad, elbows slightly bent.\n3. Bring the handles together in front and squeeze the chest.\n4. Return slowly to the stretch.",
    ],
    ["دفع الحركة بالدراع بدل الصدر، ضهر بعيد عن المسند، مدى حركة قصير.", "Pushing with the arms instead of the chest, back off the pad, short range of motion."],
    ["تخيل إنك بتقرب كوعك من بعض مش إيدك.", "Think about bringing your elbows together, not your hands."],
  ),
  "صدر/كروس اوفر عالي": c(
    ["كابل كروس أوفر من فوق لتحت بيركز على الجزء السفلي من الصدر.", "High-to-low cable crossover emphasizing the lower chest."],
    [
      "1. حط البكرات فوق وامسك المقابض واطلع خطوة لقدام.\n2. ميّل جسمك لقدام شوية والكوع مثني خفيف.\n3. اسحب المقابض لتحت وقدام لحد ما يتقابلوا قدام وسطك.\n4. ارجع ببطء لفوق مع مط الصدر.",
      "1. Set pulleys high, grab the handles and step forward.\n2. Lean slightly forward with a soft bend in the elbows.\n3. Pull the handles down and in until they meet in front of your hips.\n4. Return slowly up, feeling the chest stretch.",
    ],
    ["استخدام وزن الجسم والضهر في الشد، فرد الكوع، رجوع سريع.", "Using body weight and back to yank, straightening the elbows, fast return."],
    ["رجل قدام ورجل ورا بتديك ثبات أكتر، واعصر ثانية في الآخر.", "A staggered stance gives more stability; squeeze for a second at the end."],
  ),
  "صدر/كروس اوفر سفلي": c(
    ["كابل كروس أوفر من تحت لفوق بيركز على الجزء العلوي من الصدر.", "Low-to-high cable crossover emphasizing the upper chest."],
    [
      "1. حط البكرات تحت وامسك المقابض واقف في النص.\n2. الكوع مثني شوية والكفوف لقدام.\n3. ارفع المقابض لفوق وقدام لحد مستوى الكتف.\n4. ارجع ببطء لتحت.",
      "1. Set pulleys low, grab the handles and stand in the middle.\n2. Soft bend in the elbows, palms facing forward.\n3. Raise the handles up and in to shoulder height.\n4. Lower slowly.",
    ],
    ["رفع الإيد أعلى من الكتف، استخدام الكتف بدل الصدر، ميل الضهر لورا.", "Lifting above shoulder height, using the delts instead of the chest, leaning back."],
    ["وزن خفيف وحركة نظيفة، وركز إن الصدر العلوي هو اللي بيرفع.", "Light weight and clean reps; focus on the upper chest doing the lift."],
  ),
  "صدر/ضغط عادي": pushUp("مناسب لكل المستويات وممكن يتعمل في أي مكان.", "Suitable for all levels and can be done anywhere."),
  "صدر/ضغط 2": pushUp("نسخة تانية من الضغط لتنويع زاوية الحركة.", "A push-up variation to vary the movement angle."),
  "صدر/ضغط بأيدي واسعة": pushUp("فتح الإيد أوسع بيزود التركيز على الصدر.", "A wider hand position puts more emphasis on the chest."),
  "صدر/ضغط على الركب": c(
    ["ضغط على الركب، نسخة أسهل من الضغط العادي للمبتدئين.", "Knee push-up, an easier push-up variation for beginners."],
    [
      "1. اسند ركبك وإيديك على الأرض والإيد أوسع شوية من الكتف.\n2. خلي جسمك من الراس للركبة في خط مستقيم.\n3. انزل بصدرك لحد ما يقرب من الأرض.\n4. ادفع لفوق لحد ما الدراع يتفرد.",
      "1. Knees and hands on the floor, hands slightly wider than shoulders.\n2. Keep a straight line from head to knees.\n3. Lower your chest toward the floor.\n4. Push back up until arms are straight.",
    ],
    ["ثني الوسط بدل ما الجسم يفضل مفرود، النزول نص المسافة.", "Bending at the hips instead of staying straight, half reps."],
    ["لما توصل 15 عدة نظيفة ابدأ تنقل للضغط العادي.", "Once you can do 15 clean reps, progress to full push-ups."],
  ),
  "صدر/ضغط مائل على البنش": c(
    ["ضغط وإيدك على بنش، أسهل من الضغط العادي وبيركز على الصدر السفلي.", "Incline push-up with hands on a bench — easier than a regular push-up, emphasizes the lower chest."],
    [
      "1. حط إيدك على طرف البنش أوسع شوية من الكتف ورجلك ورا.\n2. جسمك مفرود في خط واحد.\n3. انزل بصدرك لحد ما يقرب من البنش.\n4. ادفع لفوق.",
      "1. Hands on the bench edge slightly wider than shoulders, feet back.\n2. Body in one straight line.\n3. Lower your chest toward the bench.\n4. Push back up.",
    ],
    ["الوسط ينزل لتحت، النزول نص المسافة، البنش بيتحرك.", "Sagging hips, half reps, an unstable bench."],
    ["كل ما السطح أوطى كل ما التمرين أصعب — استخدمه كتدرج للضغط العادي.", "The lower the surface, the harder it gets — use it to progress to full push-ups."],
  ),
  "صدر/ضغط مقلوب والرجل على البنش": c(
    ["ضغط والرجل مرفوعة على بنش، أصعب من العادي وبيركز على الصدر العلوي والكتف.", "Decline push-up with feet on a bench — harder than regular, emphasizes upper chest and shoulders."],
    [
      "1. حط رجلك على البنش وإيدك على الأرض أوسع من الكتف.\n2. جسمك مفرود والبطن مشدودة.\n3. انزل بصدرك لحد ما يقرب من الأرض.\n4. ادفع لفوق.",
      "1. Feet on the bench, hands on the floor wider than shoulders.\n2. Body straight, abs braced.\n3. Lower your chest toward the floor.\n4. Push back up.",
    ],
    ["الوسط ينزل، الراس بتسبق الجسم، فتح الكوع زيادة.", "Sagging hips, leading with the head, flaring elbows."],
    ["اعمله بعد ما تتقن الضغط العادي، وابدأ ببنش واطي.", "Do it only after mastering regular push-ups; start with a low bench."],
  ),

  // ───────────── ظهر ─────────────
  "ظهر/ديدلفت بالبار": c(
    ["تمرين مركب أساسي بيقوي الضهر كله والمؤخرة والخلفية والقبضة.", "A foundational compound lift for the whole back, glutes, hamstrings and grip."],
    [
      "1. اقف والبار فوق نص القدم والرجل بعرض الحوض.\n2. انزل امسك البار والضهر مفرود والصدر لفوق.\n3. ادفع الأرض برجلك وارفع البار قريب من جسمك لحد ما تقف مفرود.\n4. نزّل البار بنفس الطريقة بثني الحوض الأول.",
      "1. Stand with the bar over mid-foot, feet hip-width.\n2. Hinge down, grip the bar, back flat and chest up.\n3. Push the floor away and drag the bar up your legs until standing tall.\n4. Lower the same way, hips back first.",
    ],
    ["تقويس الضهر، البار بعيد عن الجسم، شد البار بالدراع، الميل لورا في الآخر.", "Rounding the back, bar drifting away, yanking with the arms, leaning back at lockout."],
    ["ابدأ بوزن خفيف وأتقن الحركة، وشد البطن قبل كل عدة.", "Master the pattern with light weight first, and brace your core before every rep."],
  ),
  "ظهر/تجديف بالبار 1": c(
    ["تجديف بالبار وانت منحني، بيبني سُمك الضهر.", "Bent-over barbell row for back thickness."],
    [
      "1. امسك البار وانحني لقدام من الحوض والضهر مفرود والركبة مثنية شوية.\n2. خلي البار متعلق تحت الكتف.\n3. اسحب البار ناحية أسفل الصدر/البطن وقرب لوح الكتف من بعض.\n4. نزّل ببطء.",
      "1. Hold the bar and hinge forward with a flat back and soft knees.\n2. Let the bar hang below your shoulders.\n3. Row the bar to your lower chest/upper belly, squeezing the shoulder blades.\n4. Lower slowly.",
    ],
    ["تقويس الضهر، استخدام الزخم وهز الجسم، الوقوف بزاوية عالية.", "Rounding the back, using momentum, standing too upright."],
    ["اسحب بالكوع مش بالإيد، وتخيل إنك بتحط كوعك في جيبك الخلفي.", "Pull with your elbows, not your hands — drive them toward your back pockets."],
  ),
  "ظهر/تجديف بالبار 2": c(
    ["نسخة تانية من تجديف البار لتنويع زاوية السحب.", "A barbell row variation to vary the pulling angle."],
    [
      "1. انحني من الحوض والضهر مفرود والبار في إيدك.\n2. ثبت جسمك من غير ما يتهز.\n3. اسحب البار لبطنك وقرب لوح الكتف.\n4. نزّل بتحكم.",
      "1. Hinge at the hips, back flat, bar in hand.\n2. Keep your torso still.\n3. Row the bar to your stomach, squeezing the shoulder blades.\n4. Lower under control.",
    ],
    ["هز الجسم، تقويس الضهر، رفع الكتف لفوق.", "Body swinging, rounded back, shrugging the shoulders."],
    ["ثبّت ثانية في الأعلى لزيادة الانقباض.", "Pause one second at the top for a stronger contraction."],
  ),
  "ظهر/تجديف T-bar": c(
    ["تجديف على ماكينة التي-بار، بيبني سُمك منتصف الضهر.", "T-bar row for mid-back thickness."],
    [
      "1. اقف على الماكينة وامسك المقابض وانحني والضهر مفرود.\n2. ابدأ والدراع مفرود.\n3. اسحب المقابض لصدرك وقرب لوح الكتف.\n4. نزّل ببطء.",
      "1. Stand on the machine, grab the handles and hinge with a flat back.\n2. Start with arms extended.\n3. Pull the handles to your chest, squeezing the shoulder blades.\n4. Lower slowly.",
    ],
    ["تقويس الضهر، رفع الجسم مع كل عدة، مدى حركة قصير.", "Rounded back, standing up with each rep, short range."],
    ["خلي صدرك لفوق ونظرك لقدام علشان الضهر يفضل مفرود.", "Keep your chest up and eyes forward to hold a flat back."],
  ),
  "ظهر/تجديف دمبل بذراع واحدة": c(
    ["تجديف دمبل بدراع واحد مع سند على البنش، لعضلة اللاتس ومنتصف الضهر.", "Single-arm dumbbell row supported on a bench for the lats and mid-back."],
    [
      "1. اسند ركبة وإيد على البنش والضهر مفرود.\n2. امسك الدمبل بالإيد التانية ودراعك مفرود.\n3. اسحب الدمبل ناحية الحوض والكوع قريب من الجسم.\n4. نزّل ببطء لحد المط.",
      "1. One knee and hand on the bench, back flat.\n2. Hold the dumbbell with the other arm extended.\n3. Row the dumbbell toward your hip, elbow close to your body.\n4. Lower slowly into a stretch.",
    ],
    ["لف الجسم مع السحب، شد الدمبل للكتف بدل الحوض، تقويس الضهر.", "Twisting the torso, pulling to the shoulder instead of the hip, rounding the back."],
    ["اسحب في قوس ناحية الحوض علشان تشغل اللاتس أكتر.", "Pull in an arc toward your hip to hit the lats harder."],
  ),
  "ظهر/تجديف دمبل على بنش مائل": c(
    ["تجديف دمبل وصدرك مسنود على بنش مائل، بيعزل الضهر من غير ضغط على أسفل الضهر.", "Chest-supported incline dumbbell row that isolates the back without loading the lower back."],
    [
      "1. نام على بطنك على بنش مائل 30-45 درجة والدمبلز متعلقين.\n2. اسحب الدمبلز لفوق والكوع لورا.\n3. قرب لوح الكتف من بعض في الأعلى.\n4. نزّل ببطء.",
      "1. Lie chest-down on a 30–45° bench with dumbbells hanging.\n2. Row the dumbbells up, driving elbows back.\n3. Squeeze the shoulder blades at the top.\n4. Lower slowly.",
    ],
    ["رفع الصدر من على البنش، هز الدمبلز، مدى حركة قصير.", "Lifting the chest off the pad, swinging the dumbbells, short range."],
    ["خيار ممتاز للي عنده ألم في أسفل الضهر.", "A great option for anyone with lower-back discomfort."],
  ),
  "ظهر/تجديف معكوس على العقلة": c(
    ["تجديف بوزن الجسم تحت بار، بيقوي الضهر ومناسب كتمهيد للعقلة.", "Bodyweight row under a bar, strengthens the back and builds toward pull-ups."],
    [
      "1. امسك البار وجسمك تحته مفرود ورجلك على الأرض.\n2. اسحب صدرك ناحية البار.\n3. قرب لوح الكتف من بعض في الأعلى.\n4. انزل ببطء لحد ما الدراع يتفرد.",
      "1. Hang under the bar with your body straight and heels on the floor.\n2. Pull your chest to the bar.\n3. Squeeze the shoulder blades at the top.\n4. Lower slowly until arms are straight.",
    ],
    ["الوسط ينزل، شد الراس لقدام بدل الصدر، مدى حركة قصير.", "Sagging hips, reaching with the chin, short range."],
    ["كل ما جسمك يكون أفقي أكتر كل ما التمرين أصعب.", "The more horizontal your body, the harder it gets."],
  ),
  "ظهر/عقلة": c(
    ["العقلة من أقوى تمارين بناء عرض الضهر وعضلة اللاتس.", "Pull-ups are one of the best exercises for back width and the lats."],
    [
      "1. امسك البار أوسع شوية من الكتف والكفوف لقدام.\n2. اتعلق والدراع مفرود والبطن مشدودة.\n3. اسحب جسمك لفوق لحد ما الدقن تعدي البار.\n4. انزل ببطء لحد ما الدراع يتفرد.",
      "1. Grip the bar slightly wider than shoulders, palms forward.\n2. Hang with arms straight and core braced.\n3. Pull yourself up until your chin clears the bar.\n4. Lower slowly to a full hang.",
    ],
    ["المرجحة واستخدام الرجل، النزول نص المسافة، رفع الكتف للودن.", "Kipping and swinging, half reps, shrugging the shoulders to the ears."],
    ["لو مش قادر تعمل عدة كاملة ابدأ بالأستك أو النزول البطيء لحد ما تقوى.", "Can't do a full rep? Use a band or slow negatives until you're stronger."],
  ),
  "ظهر/سحب أمامي بالكابل": c(
    ["سحب أمامي على الكابل لبناء عرض الضهر، بديل للعقلة.", "Cable lat pulldown for back width, a pull-up alternative."],
    [
      "1. اقعد وثبت رجلك تحت المسند وامسك البار أوسع من الكتف.\n2. ميل لورا شوية والصدر لفوق.\n3. اسحب البار لأعلى الصدر والكوع لتحت.\n4. ارجع ببطء لحد ما الدراع يتفرد.",
      "1. Sit with thighs under the pad, grip the bar wider than shoulders.\n2. Lean back slightly, chest up.\n3. Pull the bar to your upper chest, driving elbows down.\n4. Return slowly until arms are straight.",
    ],
    ["السحب ورا الرقبة، الميل لورا زيادة، استخدام الزخم.", "Pulling behind the neck, leaning back too far, using momentum."],
    ["فكر إنك بتنزل كوعك لجيبك مش بتشد بإيدك.", "Think of driving your elbows into your pockets rather than pulling with your hands."],
  ),
  "ظهر/سحب أمامي واسع": c(
    ["سحب أمامي بقبضة واسعة، بيركز على الجزء الخارجي من اللاتس.", "Wide-grip lat pulldown that emphasizes the outer lats."],
    [
      "1. امسك البار من الأطراف بقبضة واسعة.\n2. اقعد والصدر لفوق.\n3. اسحب البار لأعلى الصدر.\n4. ارجع ببطء.",
      "1. Grip the bar near the ends with a wide grip.\n2. Sit tall, chest up.\n3. Pull the bar to your upper chest.\n4. Return slowly.",
    ],
    ["قبضة واسعة زيادة تقلل مدى الحركة، الشد بالدراع، هز الجسم.", "A grip so wide it shortens the range, arm-pulling, body swinging."],
    ["ثبّت ثانية تحت واعصر الضهر.", "Pause a second at the bottom and squeeze the back."],
  ),
  "ظهر/سحب كابل بذراع واحدة": c(
    ["سحب كابل بدراع واحد، بيصلح عدم التوازن بين الجنبين.", "Single-arm cable pulldown that fixes left/right imbalances."],
    [
      "1. اقعد قدام الكابل وامسك المقبض بإيد واحدة.\n2. ابدأ والدراع مفرود لفوق مع مط اللاتس.\n3. اسحب المقبض لتحت ناحية الكتف والكوع لجنبك.\n4. ارجع ببطء.",
      "1. Sit facing the cable and grab the handle with one hand.\n2. Start with the arm extended overhead, lat stretched.\n3. Pull the handle down toward your shoulder, elbow to your side.\n4. Return slowly.",
    ],
    ["لف الجسم، الشد بالباي بدل الضهر، رجوع سريع.", "Rotating the torso, pulling with the biceps, fast return."],
    ["ابدأ بالجنب الأضعف وكمّل نفس العدد للجنب التاني.", "Start with your weaker side and match the reps on the other."],
  ),

  // ───────────── كتف ─────────────
  "كتف/رفرفة خلفي بالدمبل": c(
    ["رفرفة خلفي بالدمبل وانت منحني، لعزل الكتف الخلفي وتحسين القوام.", "Bent-over dumbbell rear delt fly to isolate the rear delts and improve posture."],
    [
      "1. انحني لقدام من الحوض والضهر مفرود والدمبلز متعلقين.\n2. الكوع مثني شوية.\n3. ارفع الدمبلز لجنبك لحد مستوى الكتف.\n4. نزّل ببطء.",
      "1. Hinge forward with a flat back, dumbbells hanging.\n2. Soft bend in the elbows.\n3. Raise the dumbbells out to the sides to shoulder height.\n4. Lower slowly.",
    ],
    ["وزن تقيل يخلي الضهر يشتغل بدل الكتف، هز الجسم، رفع الكتف للودن.", "Going heavy so the back takes over, swinging, shrugging."],
    ["وزن خفيف وعدات كتير (12-20) أحسن للكتف الخلفي.", "Light weight and higher reps (12–20) work best for rear delts."],
  ),

  // ───────────── رجل أمامية ─────────────
  "رجل أمامية/باك سكوات": c(
    ["السكوات بالبار على الضهر، ملك تمارين الرجل للعضلة الأمامية والمؤخرة.", "Barbell back squat, the king of leg exercises for quads and glutes."],
    [
      "1. حط البار على أعلى الضهر واقف والرجل بعرض الكتف.\n2. شد البطن وانزل بالحوض لورا وتحت.\n3. انزل لحد ما الفخد يبقى موازي للأرض أو أوطى.\n4. ادفع الأرض واطلع لفوق.",
      "1. Bar on your upper back, feet shoulder-width.\n2. Brace your core and sit down and back.\n3. Descend until thighs are parallel or below.\n4. Drive through the floor to stand.",
    ],
    ["الركبة تدخل لجوه، رفع الكعب، تقويس الضهر، النزول نص المسافة.", "Knees caving in, heels lifting, rounding the back, half reps."],
    ["الركبة تمشي في اتجاه صوابع رجلك، واستخدم الرف الأمان في الأوزان التقيلة.", "Track your knees over your toes, and use safety pins on heavy sets."],
  ),
  "رجل أمامية/فرونت سكوات": c(
    ["سكوات والبار قدام على الكتف، بيركز أكتر على العضلة الأمامية.", "Front squat with the bar on the front of the shoulders, more quad-focused."],
    [
      "1. حط البار على مقدمة الكتف والكوع لفوق.\n2. الرجل بعرض الكتف والجسم مفرود.\n3. انزل لتحت والجذع شبه عمودي.\n4. اطلع لفوق والكوع لسه مرفوع.",
      "1. Rest the bar on the front of your shoulders, elbows high.\n2. Feet shoulder-width, torso upright.\n3. Squat down keeping the torso nearly vertical.\n4. Stand up while keeping elbows high.",
    ],
    ["الكوع ينزل فالبار يقع لقدام، الميل لقدام، رفع الكعب.", "Elbows dropping so the bar rolls forward, leaning forward, heels rising."],
    ["لو المرونة ضعيفة استخدم مسكة الدراع المتقاطعة أو حط حاجة تحت الكعب.", "If mobility is limited, use a cross-arm grip or raise your heels slightly."],
  ),
  "رجل أمامية/جوبلت سكوات": c(
    ["سكوات والدمبل قدام الصدر، ممتاز للمبتدئين لتعلم حركة السكوات.", "Goblet squat with a dumbbell at the chest, ideal for learning the squat."],
    [
      "1. امسك الدمبل قدام صدرك بإيديك الاتنين.\n2. الرجل أوسع شوية من الكتف.\n3. انزل لتحت والكوع بين الركبتين.\n4. اطلع لفوق والصدر مرفوع.",
      "1. Hold a dumbbell vertically at your chest with both hands.\n2. Feet slightly wider than shoulders.\n3. Squat down with elbows between your knees.\n4. Stand up with chest tall.",
    ],
    ["الدمبل يبعد عن الصدر، الميل لقدام، رفع الكعب.", "Dumbbell drifting away from the chest, leaning forward, heels lifting."],
    ["استخدم الكوع علشان تزق الركبة لبره في الأسفل.", "Use your elbows to gently push your knees out at the bottom."],
  ),
  "رجل أمامية/سومو سكوات بالدمبل": c(
    ["سكوات برجل واسعة والدمبل متعلق، بيشغل الفخد الداخلي والمؤخرة.", "Wide-stance dumbbell sumo squat targeting inner thighs and glutes."],
    [
      "1. اقف برجل واسعة وصوابعك لبره.\n2. امسك الدمبل بإيديك الاتنين متعلق قدامك.\n3. انزل لتحت والضهر مفرود.\n4. اطلع واعصر المؤخرة في الأعلى.",
      "1. Stand wide with toes turned out.\n2. Hold one dumbbell with both hands hanging in front.\n3. Squat down with a straight back.\n4. Stand and squeeze the glutes at the top.",
    ],
    ["الركبة تدخل لجوه، الميل لقدام، النزول نص المسافة.", "Knees caving in, leaning forward, half reps."],
    ["الركبة لازم تمشي في نفس اتجاه صوابع الرجل.", "Keep your knees pointing the same way as your toes."],
  ),
  "رجل أمامية/سكوات بوزن الجسم": c(
    ["سكوات بوزن الجسم، أساس كل تمارين الرجل ومناسب للإحماء والمبتدئين.", "Bodyweight squat — the foundation of leg training, great for warm-ups and beginners."],
    [
      "1. اقف والرجل بعرض الكتف.\n2. مد دراعاتك قدامك للتوازن.\n3. انزل بالحوض لورا وتحت لحد ما الفخد يوازي الأرض.\n4. اطلع لفوق.",
      "1. Stand with feet shoulder-width.\n2. Extend your arms forward for balance.\n3. Sit your hips down and back until thighs are parallel.\n4. Stand back up.",
    ],
    ["رفع الكعب، الركبة تدخل لجوه، تقويس الضهر.", "Heels rising, knees caving, rounding the back."],
    ["ركز على السرعة البطيئة في النزول (3 ثواني) لزيادة الصعوبة.", "Slow the descent (3 seconds) to make it harder."],
  ),
  "رجل أمامية/هاك سكوات": c(
    ["سكوات على ماكينة الهاك، بيعزل العضلة الأمامية بأمان.", "Hack squat machine that safely targets the quads."],
    [
      "1. اقف على المنصة وضهرك لازق في المسند والكتف تحت المساند.\n2. الرجل بعرض الكتف.\n3. انزل لحد ما الفخد يوازي المنصة.\n4. ادفع واطلع من غير ما تقفل الركبة.",
      "1. Stand on the platform, back on the pad, shoulders under the pads.\n2. Feet shoulder-width.\n3. Lower until thighs are parallel to the platform.\n4. Press up without locking the knees.",
    ],
    ["قفل الركبة بعنف، رفع الكعب، النزول نص المسافة.", "Slamming the knees locked, heels rising, half reps."],
    ["الرجل أوطى على المنصة = تركيز أكتر على الأمامية.", "Feet lower on the platform = more quad focus."],
  ),
  "رجل أمامية/ليج برس": c(
    ["ضغط رجل على الماكينة، بيبني الأمامية والمؤخرة بضغط أقل على الضهر.", "Leg press for quads and glutes with less spinal load."],
    [
      "1. اقعد وضهرك لازق في المسند والرجل على المنصة بعرض الكتف.\n2. فك الأمان.\n3. نزّل المنصة لحد ما الركبة تبقى 90 درجة.\n4. ادفع لفوق من غير ما تقفل الركبة.",
      "1. Sit with your back flat and feet shoulder-width on the platform.\n2. Release the safety.\n3. Lower until knees reach about 90°.\n4. Press up without locking the knees.",
    ],
    ["رفع المؤخرة من على الكرسي، قفل الركبة، الركبة تدخل لجوه.", "Hips lifting off the seat, locking the knees, knees caving in."],
    ["ماتنزلش لدرجة إن أسفل ضهرك يتقوس من على المسند.", "Don't go so deep that your lower back rounds off the pad."],
  ),
  "رجل أمامية/ليج اكستنشن": c(
    ["رفرفة أمامي على الماكينة، تمرين عزل للعضلة الأمامية.", "Leg extension machine, a quad isolation exercise."],
    [
      "1. اظبط الكرسي بحيث الركبة على حافة الكرسي والمسند فوق الكاحل.\n2. امسك المقابض.\n3. افرد رجلك لفوق واعصر الأمامية ثانية.\n4. نزّل ببطء.",
      "1. Set the seat so knees line up with the pivot and the pad sits above the ankles.\n2. Hold the handles.\n3. Extend your legs and squeeze the quads for a second.\n4. Lower slowly.",
    ],
    ["رمي الوزن بسرعة، رفع المؤخرة، وزن تقيل يضغط على الركبة.", "Kicking the weight up, lifting the hips, going too heavy for the knees."],
    ["وزن متوسط وعدات أكتر أأمن للركبة.", "Moderate weight and higher reps are kinder to the knees."],
  ),
  "رجل أمامية/طعن": c(
    ["طعن بوزن الجسم، بيقوي الرجل والمؤخرة والتوازن.", "Bodyweight lunge for legs, glutes and balance."],
    [
      "1. اقف مفرود وإيدك على وسطك.\n2. اطلع خطوة لقدام بواسع.\n3. انزل لحد ما الركبتين يبقوا 90 درجة والركبة الخلفية قريبة من الأرض.\n4. ادفع بالرجل القدامية وارجع لمكانك.",
      "1. Stand tall, hands on hips.\n2. Take a long step forward.\n3. Lower until both knees are at 90°, back knee near the floor.\n4. Push off the front foot to return.",
    ],
    ["خطوة قصيرة زيادة، الركبة الأمامية تدخل لجوه، الميل لقدام.", "Too short a step, front knee caving, leaning forward."],
    ["الجذع مفرود والوزن على كعب الرجل القدامية.", "Keep your torso upright and weight on the front heel."],
  ),
  "رجل أمامية/بلغاري سبليت سكوات": c(
    ["سكوات برجل واحدة والرجل التانية على بنش، من أقوى تمارين الرجل الفردية.", "Bulgarian split squat with the rear foot on a bench — one of the best single-leg exercises."],
    [
      "1. حط وش رجلك الخلفية على البنش والرجل القدامية لقدام.\n2. انزل لتحت لحد ما الفخد القدامي يوازي الأرض.\n3. خلي الوزن على الرجل القدامية.\n4. ادفع واطلع لفوق.",
      "1. Rear foot laces-down on the bench, front foot forward.\n2. Lower until the front thigh is parallel.\n3. Keep weight on the front leg.\n4. Drive back up.",
    ],
    ["الرجل القدامية قريبة من البنش زيادة، الركبة تدخل، الوزن على الرجل الخلفية.", "Front foot too close to the bench, knee caving, weight on the back leg."],
    ["ميل خفيف لقدام = مؤخرة أكتر، جذع مفرود = أمامية أكتر.", "Slight forward lean = more glutes; upright torso = more quads."],
  ),
  "رجل أمامية/صعود على البنش": c(
    ["صعود على البنش برجل واحدة، بيقوي الرجل والمؤخرة والتوازن.", "Bench step-up for legs, glutes and balance."],
    [
      "1. حط رجل كاملة على البنش.\n2. ادفع بالرجل اللي فوق واطلع لحد ما تقف مفرود.\n3. انزل ببطء بنفس الرجل.\n4. كمّل العدات وبدّل الرجل.",
      "1. Place one whole foot on the bench.\n2. Drive through that foot to stand tall on the bench.\n3. Step down slowly with control.\n4. Finish the reps, then switch legs.",
    ],
    ["الدفع بالرجل اللي على الأرض، البنش عالي زيادة، الركبة تدخل.", "Pushing off the bottom foot, bench too high, knee caving."],
    ["ابدأ بارتفاع الركبة أو أقل، وزوّد دمبلز لما تقوى.", "Start at knee height or lower, then add dumbbells as you get stronger."],
  ),
  "رجل أمامية/جلوس على الحائط": c(
    ["ثبات على الحائط، تمرين تحمل للعضلة الأمامية من غير حركة.", "Wall sit, an isometric quad endurance exercise."],
    [
      "1. اسند ضهرك على الحائط.\n2. انزل لحد ما الفخد يوازي الأرض والركبة 90 درجة.\n3. اثبت في الوضع ده للوقت المطلوب.\n4. اطلع ببطء.",
      "1. Lean your back against the wall.\n2. Slide down until thighs are parallel and knees at 90°.\n3. Hold for the prescribed time.\n4. Slide back up slowly.",
    ],
    ["الركبة قدام صوابع الرجل، سند الإيد على الفخد، النزول نص المسافة.", "Knees past the toes, resting hands on thighs, not going low enough."],
    ["ابدأ بـ 20-30 ثانية وزوّد تدريجيًا.", "Start with 20–30 seconds and build up gradually."],
  ),

  // ───────────── رجل خلفية ─────────────
  "رجل خلفية/رومانيان ديدلفت بالبار": c(
    ["رومانيان ديدلفت بالبار، من أفضل تمارين الخلفية والمؤخرة.", "Barbell Romanian deadlift, a top exercise for hamstrings and glutes."],
    [
      "1. اقف والبار في إيدك والركبة مثنية شوية.\n2. ارجع بالحوض لورا والبار ينزل قريب من رجلك.\n3. انزل لحد ما تحس بمط في الخلفية (تحت الركبة تقريبًا).\n4. ادفع الحوض لقدام وارجع وقف.",
      "1. Stand holding the bar with soft knees.\n2. Push your hips back, sliding the bar down your legs.\n3. Lower until you feel a hamstring stretch (around shin level).\n4. Drive your hips forward to stand.",
    ],
    ["تقويس الضهر، ثني الركبة زيادة فيتحول لسكوات، البار بعيد عن الرجل.", "Rounding the back, bending the knees too much (becomes a squat), bar drifting away."],
    ["الحركة من الحوض مش من الضهر — فكر إنك بتقفل باب بمؤخرتك.", "Move from the hips, not the back — think about closing a door with your butt."],
  ),
  "رجل خلفية/رومانيان ديدلفت برجل واحدة": c(
    ["رومانيان ديدلفت برجل واحدة، بيقوي الخلفية والمؤخرة والتوازن.", "Single-leg Romanian deadlift for hamstrings, glutes and balance."],
    [
      "1. اقف على رجل واحدة والركبة مثنية شوية.\n2. ميل لقدام والرجل التانية تطلع لورا في خط مع جسمك.\n3. انزل لحد ما جسمك يبقى قريب من الموازي للأرض.\n4. ارجع وقف واعصر المؤخرة.",
      "1. Stand on one leg with a soft knee.\n2. Hinge forward as the free leg extends behind in line with your body.\n3. Lower until your torso is near parallel.\n4. Return to standing and squeeze the glute.",
    ],
    ["لف الحوض لبره، تقويس الضهر، فقدان التوازن من السرعة.", "Hips rotating open, rounding the back, losing balance from rushing."],
    ["امسك حاجة بإيدك للتوازن في الأول، وبعدين زوّد دمبل.", "Hold onto something for balance at first, then add a dumbbell."],
  ),
  "رجل خلفية/ديدلفت بالبار للأرجل": c(
    ["ديدلفت بالبار مع تركيز على شغل الرجل والمؤخرة.", "Barbell deadlift with emphasis on the legs and glutes."],
    [
      "1. اقف والبار فوق نص القدم.\n2. انزل امسك البار والضهر مفرود.\n3. ادفع الأرض برجلك وارفع البار لحد ما تقف.\n4. نزّل البار بتحكم.",
      "1. Stand with the bar over mid-foot.\n2. Hinge down and grip the bar with a flat back.\n3. Push through your legs to stand up with the bar.\n4. Lower under control.",
    ],
    ["تقويس الضهر، الحوض يطلع أسرع من الكتف، البار بعيد عن الجسم.", "Rounded back, hips shooting up first, bar away from the body."],
    ["فكر إنك بتزق الأرض لتحت برجلك مش بتشد البار لفوق.", "Think of pushing the floor away rather than pulling the bar up."],
  ),
  "رجل خلفية/ليج كيرل نايم": c(
    ["رفرفة خلفي نايم على الماكينة، عزل للعضلة الخلفية.", "Lying leg curl, a hamstring isolation exercise."],
    [
      "1. نام على بطنك والمسند فوق الكاحل والركبة على حافة الكرسي.\n2. امسك المقابض.\n3. اثني رجلك لفوق ناحية المؤخرة.\n4. نزّل ببطء.",
      "1. Lie face-down with the pad above your ankles and knees just off the bench.\n2. Hold the handles.\n3. Curl your heels toward your glutes.\n4. Lower slowly.",
    ],
    ["رفع الحوض من على البنش، رمي الوزن، رجوع سريع.", "Hips lifting off the bench, swinging the weight, fast return."],
    ["ثبّت الحوض على البنش وخلي النزول 3 ثواني.", "Keep your hips pinned down and take 3 seconds on the way down."],
  ),
  "رجل خلفية/ليج كيرل واقف": c(
    ["رفرفة خلفي واقف برجل واحدة على الماكينة.", "Standing single-leg curl on the machine."],
    [
      "1. اقف وامسك المقابض والمسند ورا الكاحل.\n2. ثبت الركبة اللي شغالة جنب الماكينة.\n3. اثني رجلك لفوق ناحية المؤخرة.\n4. نزّل ببطء وبدّل الرجل.",
      "1. Stand holding the handles with the pad behind your ankle.\n2. Keep the working knee in line with the machine pivot.\n3. Curl your heel toward your glute.\n4. Lower slowly, then switch legs.",
    ],
    ["تحريك الفخد لقدام، ميل الجسم، رمي الوزن.", "Thigh drifting forward, leaning the body, swinging the weight."],
    ["ممتاز لتصليح الفرق بين الرجلين.", "Great for fixing strength differences between legs."],
  ),

  // ───────────── سمانة ─────────────
  "سمانة/رفع سمانة واقف": c(
    ["رفع سمانة واقف، بيقوي عضلة السمانة (الجاستروك).", "Standing calf raise for the calves (gastrocnemius)."],
    [
      "1. اقف بمقدمة رجلك على حافة سطح والكعب متعلق.\n2. نزّل الكعب لتحت لحد المط.\n3. اطلع على أطراف صوابعك لأعلى نقطة.\n4. ثبت ثانية ونزّل ببطء.",
      "1. Stand with the balls of your feet on an edge, heels hanging.\n2. Lower your heels into a stretch.\n3. Rise onto your toes as high as possible.\n4. Pause a second, then lower slowly.",
    ],
    ["الحركة بسرعة ونطّ، مدى حركة قصير، ثني الركبة.", "Bouncing fast, short range, bending the knees."],
    ["السمانة محتاجة مدى حركة كامل وعدات كتير (15-25).", "Calves need full range and higher reps (15–25)."],
  ),
  "سمانة/رفع سمانة جالس بالطارة": c(
    ["رفع سمانة وانت قاعد والطارة على الفخد، بيركز على عضلة السوليس.", "Seated calf raise with a plate on the thighs, emphasizing the soleus."],
    [
      "1. اقعد على البنش ومقدمة رجلك على طارة أو سطح عالي.\n2. حط الطارة على فخدك قريب من الركبة.\n3. ارفع الكعب لفوق لأعلى نقطة.\n4. نزّل ببطء لحد المط.",
      "1. Sit on a bench with the balls of your feet on a plate or step.\n2. Place a weight plate on your thighs near the knees.\n3. Raise your heels as high as possible.\n4. Lower slowly into a stretch.",
    ],
    ["الحركة سريعة، مدى قصير، استخدام الإيد في رفع الوزن.", "Rushing, short range, lifting the weight with your hands."],
    ["ثبّت ثانية فوق وثانية تحت.", "Pause one second at the top and one at the bottom."],
  ),

  // ───────────── مؤخرة ─────────────
  "مؤخرة/ركلة خلفية على الأربع": c(
    ["ركلة خلفية على الأربع، تمرين عزل للمؤخرة بوزن الجسم.", "Donkey kick on all fours, a bodyweight glute isolation exercise."],
    [
      "1. انزل على إيديك وركبك والضهر مفرود.\n2. ارفع رجل لورا ولفوق والركبة مثنية 90 درجة.\n3. اعصر المؤخرة في الأعلى ثانية.\n4. نزّل ببطء وكمّل ثم بدّل.",
      "1. Get on hands and knees with a flat back.\n2. Kick one leg up and back, knee bent at 90°.\n3. Squeeze the glute for a second at the top.\n4. Lower slowly, finish the set, then switch.",
    ],
    ["تقويس أسفل الضهر، لف الحوض، الحركة بسرعة.", "Arching the lower back, rotating the hips, rushing."],
    ["زوّد أستك أو دمبل خلف الركبة لما يبقى سهل.", "Add a band or a dumbbell behind the knee once it gets easy."],
  ),
};
