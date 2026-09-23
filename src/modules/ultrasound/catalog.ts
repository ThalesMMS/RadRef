/** Reference-only content. No patient classification, persistence, or network lookup. */
export type UltrasoundLanguage = 'en' | 'pt';
export type LocalizedText = Readonly<Record<UltrasoundLanguage, string>>;
const text = (en: string, pt: string): LocalizedText => ({ en, pt });
export const ultrasoundReviewedOn = '2026-09-22';

export const ultrasoundSources = [
  { id: 'abdomen', title: 'Polish Ultrasound Society — liver, gallbladder and bile ducts', year: '2012', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4603239/' },
  { id: 'gallbladder', title: 'Ultrasound of the gallbladder — measurements and reference values', year: '2025', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12193774/' },
  { id: 'spleen', title: 'Polish Ultrasound Society — spleen examination', year: '2013', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4613573/' },
  { id: 'pancreas', title: 'Pancreatic ultrasound — measurements, reference values and variations', year: '2024', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11475099/' },
  { id: 'kidney', title: 'Ultrasonography of the kidney: a pictorial review', year: '2016', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4808817/' },
  { id: 'urinary', title: 'Polish Ultrasound Society — kidneys, ureters and urinary bladder', year: '2013', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4603215/' },
  { id: 'prostate', title: 'European Academy of Andrology — transrectal ultrasound in healthy fertile men', year: '2022', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9544532/' },
  { id: 'thyroid', title: 'Korean Society of Thyroid Radiology — thyroid ultrasound consensus', year: '2023', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9830140/' },
  { id: 'axilla', title: 'Multiparametric ultrasound assessment of axillary lymph nodes', year: '2024', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11452636/' },
  { id: 'breastSkin', title: 'Quantitative ultrasound of late tissue toxicity after breast radiotherapy', year: '2010', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2888858/' },
  { id: 'acog2026', title: 'ACOG — updated evaluation of postmenopausal bleeding', year: '2026', url: 'https://www.acog.org/news/news-releases/2026/04/acog-publishes-updated-guidance-evaluation-postmenopausal-bleeding' },
  { id: 'acogMethod', title: 'ACOG Committee Opinion 734 — measurement technique (triage updated in 2026)', year: '2018 / 2026', url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/05/the-role-of-transvaginal-ultrasonography-in-evaluating-the-endometrium-of-women-with-postmenopausal-bleeding' },
  { id: 'pcos', title: 'International evidence-based guideline — polycystic ovary syndrome', year: '2023', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10477934/' },
  { id: 'isuogCns', title: 'ISUOG — fetal central nervous system, Part 1', year: '2020', url: 'https://doi.org/10.1002/uog.22145' },
  { id: 'isuogBiometry', title: 'ISUOG — routine mid-trimester fetal ultrasound', year: '2022', url: 'https://doi.org/10.1002/uog.24888' },
  { id: 'esur', title: 'ESUR-SPIWG — ultrasound evaluation of varicoceles', year: '2020', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7588576/' },
  { id: 'iac', title: 'IAC — updated carotid stenosis interpretation criteria', year: '2023', url: 'https://intersocietal.org/document/carotid-stenosis-interpretation-criteria/' },
  { id: 'aorta', title: 'ACC/AHA — diagnosis and management of aortic disease', year: '2022', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9876736/' },
  { id: 'median', title: 'Sonographic reference values for median nerve cross-sectional area', year: '2023', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10468154/' },
  { id: 'fascia', title: 'Ultrasonographic assessment of plantar fasciitis', year: '2020', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7425221/' },
  { id: 'pylorus', title: 'Diagnostic accuracy of ultrasound for infantile hypertrophic pyloric stenosis', year: '2022', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9793478/' },
  { id: 'pylorusTechnique', title: 'Hypertrophic pyloric stenosis — tips and tricks for ultrasound diagnosis', year: '2012', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3369120/' },
  { id: 'pediatricKidney', title: 'Kidney length normative values in children aged 0–19 years', year: '2021 / 2022', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9023417/' },
] as const;
export type UltrasoundSourceId = typeof ultrasoundSources[number]['id'];

export const ultrasoundExams = [
  { id: 'abdomen', title: text('Abdominal ultrasound', 'Abdome'), description: text('Liver, biliary tract, spleen and pancreas.', 'Fígado, vias biliares, baço e pâncreas.') },
  { id: 'urinary', title: text('Kidneys and urinary tract', 'Rins e vias urinárias'), description: text('Renal dimensions, cortex and bladder assessment.', 'Dimensões renais, córtex e avaliação vesical.') },
  { id: 'prostate', title: text('Prostate', 'Próstata'), description: text('Source-specific volume and anteroposterior diameter.', 'Volume e diâmetro anteroposterior conforme a população estudada.') },
  { id: 'thyroid', title: text('Thyroid and neck', 'Tireoide e região cervical'), description: text('Thyroid lobes and isthmus.', 'Lobos tireoidianos e istmo.') },
  { id: 'breast', title: text('Breast and axilla', 'Mamas e axilas'), description: text('Axillary cortex and breast skin measurement.', 'Córtex linfonodal axilar e medida da pele mamária.') },
  { id: 'pelvic', title: text('Pelvic / transvaginal', 'Pélvica / transvaginal'), description: text('Endometrial thickness and ovarian volume.', 'Espessura endometrial e volume ovariano.') },
  { id: 'obstetric', title: text('Obstetric ultrasound', 'Obstétrica'), description: text('Fetal CNS measurements and gestational-age biometry.', 'Medidas do SNC fetal e biometria por idade gestacional.') },
  { id: 'scrotal', title: text('Scrotal ultrasound', 'Escrotal'), description: text('Testicular volume, veins and reflux.', 'Volume testicular, veias e refluxo.') },
  { id: 'vascular', title: text('Vascular Doppler', 'Doppler vascular'), description: text('Native carotid criteria and abdominal aortic diameter.', 'Critérios carotídeos nativos e diâmetro da aorta abdominal.') },
  { id: 'musculoskeletal', title: text('Musculoskeletal ultrasound', 'Musculoesquelética'), description: text('Median nerve and plantar fascia.', 'Nervo mediano e fáscia plantar.') },
  { id: 'pediatric', title: text('Pediatric ultrasound', 'Pediátrica'), description: text('Pylorus and height-dependent renal size.', 'Piloro e dimensões renais dependentes da estatura.') },
] as const;
export type UltrasoundExamId = typeof ultrasoundExams[number]['id'];
export type MeasurementKind = 'reference' | 'criterion' | 'mean' | 'formula' | 'context';
export type MeasurementField = 'name' | 'value' | 'population' | 'method' | 'caution';
export type UltrasoundMeasurement = Readonly<{
  id: string;
  examId: UltrasoundExamId;
  kind: MeasurementKind;
  name: LocalizedText;
  value: LocalizedText;
  population: LocalizedText;
  method: LocalizedText;
  caution: LocalizedText;
  sourceIds: readonly UltrasoundSourceId[];
}>;
const adult = text('Adults', 'Adultos');

export const ultrasoundMeasurements: readonly UltrasoundMeasurement[] = [
  {
    id: 'liver-size', examId: 'abdomen', kind: 'context',
    name: text('Liver size', 'Dimensões hepáticas'), value: text('Plane- and body-size-dependent', 'Dependem do plano e do biotipo'), population: adult,
    method: text('Document the lobe, axis and scan plane used; compare like-for-like measurements.', 'Registrar lobo, eixo e plano utilizados; comparar medidas obtidas da mesma forma.'),
    caution: text('Do not equate a longitudinal, oblique or AP diameter. Shape and body size limit single-number definitions of hepatomegaly.', 'Não equiparar diâmetros longitudinal, oblíquo e AP. Forma e biotipo limitam a definição de hepatomegalia por um único número.'), sourceIds: ['abdomen'],
  },
  {
    id: 'gallbladder-wall', examId: 'abdomen', kind: 'reference',
    name: text('Gallbladder wall', 'Parede da vesícula biliar'), value: text('<3 mm', '<3 mm'), population: adult,
    method: text('Fasting examination; measure one anterior wall layer at the liver interface.', 'Exame em jejum; medir uma camada da parede anterior na interface hepática.'),
    caution: text('Contraction and systemic edema can thicken the wall. Thickness alone does not diagnose cholecystitis.', 'Contração e edema sistêmico podem espessar a parede. A espessura isolada não diagnostica colecistite.'), sourceIds: ['gallbladder'],
  },
  {
    id: 'bile-duct', examId: 'abdomen', kind: 'reference',
    name: text('Extrahepatic bile duct', 'Via biliar extra-hepática'), value: text('<6 mm (source convention)', '<6 mm (convenção da fonte)'), population: text('Adults with gallbladder in situ', 'Adultos com vesícula in situ'),
    method: text('Measure the luminal diameter perpendicular to the duct; state the sampled segment.', 'Medir o diâmetro luminal perpendicular ao ducto; informar o segmento amostrado.'),
    caution: text('Age, cholecystectomy and measurement site alter the expected caliber. This is not a universal obstruction threshold.', 'Idade, colecistectomia e local da medida alteram o calibre esperado. Não é um limiar universal de obstrução.'), sourceIds: ['abdomen'],
  },
  {
    id: 'spleen-length', examId: 'abdomen', kind: 'reference',
    name: text('Splenic length', 'Comprimento esplênico'), value: text('≤120 mm', '≤120 mm'), population: adult,
    method: text('Longest longitudinal dimension through the splenic hilum; avoid foreshortening.', 'Maior dimensão longitudinal passando pelo hilo; evitar encurtamento do eixo.'),
    caution: text('Source-specific reference; tall healthy adults can exceed this value. Assess body size and the other findings.', 'Referência da fonte; adultos altos e saudáveis podem ultrapassar esse valor. Considerar biotipo e demais achados.'), sourceIds: ['spleen'],
  },
  {
    id: 'pancreatic-duct', examId: 'abdomen', kind: 'reference',
    name: text('Main pancreatic duct — body', 'Ducto pancreático principal — corpo'), value: text('<2 mm; age affects the limit', '<2 mm; a idade modifica o limite'), population: adult,
    method: text('Inner-to-inner diameter in the pancreatic body, preferably supine.', 'Diâmetro interno no corpo pancreático, preferencialmente em decúbito dorsal.'),
    caution: text('The 2024 review allows up to 2.5 mm after age 50. Position and duct segment matter; an abrupt caliber change needs assessment regardless of size.', 'A revisão de 2024 admite até 2,5 mm após 50 anos. Posição e segmento importam; mudança abrupta de calibre requer avaliação independentemente do tamanho.'), sourceIds: ['pancreas'],
  },
  {
    id: 'renal-length', examId: 'urinary', kind: 'reference',
    name: text('Renal length', 'Comprimento renal'), value: text('Usually 10–12 cm', 'Habitualmente 10–12 cm'), population: adult,
    method: text('Maximum bipolar length in a true longitudinal renal plane.', 'Maior comprimento bipolar em plano longitudinal renal verdadeiro.'),
    caution: text('Height, age and body size matter. Do not apply this adult range to children.', 'Estatura, idade e biotipo importam. Não aplicar esta faixa adulta a crianças.'), sourceIds: ['kidney'],
  },
  {
    id: 'renal-cortex', examId: 'urinary', kind: 'reference',
    name: text('Renal cortical thickness', 'Espessura cortical renal'), value: text('7–10 mm', '7–10 mm'), population: adult,
    method: text('From the base of a medullary pyramid to the renal capsule.', 'Da base de uma pirâmide medular até a cápsula renal.'),
    caution: text('Do not confuse cortical thickness with total parenchymal thickness.', 'Não confundir espessura cortical com espessura parenquimatosa total.'), sourceIds: ['kidney'],
  },
  {
    id: 'renal-parenchyma', examId: 'urinary', kind: 'reference',
    name: text('Renal parenchymal thickness', 'Espessura do parênquima renal'), value: text('15–20 mm', '15–20 mm'), population: adult,
    method: text('Capsule-to-sinus parenchymal thickness, including cortex and medulla.', 'Espessura entre cápsula e seio renal, incluindo córtex e medula.'),
    caution: text('Useful when pyramids are indistinct; not interchangeable with cortical thickness.', 'Útil quando as pirâmides são pouco individualizadas; não é intercambiável com a espessura cortical.'), sourceIds: ['kidney'],
  },
  {
    id: 'bladder-residual', examId: 'urinary', kind: 'context',
    name: text('Post-void residual', 'Resíduo pós-miccional'), value: text('Report in mL; no single cutoff here', 'Informar em mL; sem corte único aqui'), population: adult,
    method: text('Record bladder filling, post-void volume and timing of the measurement.', 'Registrar repleção, volume pós-miccional e momento da medida.'),
    caution: text('Interpret with symptoms, initial filling and repeatability, rather than an isolated universal normal value.', 'Interpretar com sintomas, repleção inicial e reprodutibilidade, em vez de um valor universal isolado de normalidade.'), sourceIds: ['urinary'],
  },
  {
    id: 'prostate-volume', examId: 'prostate', kind: 'reference',
    name: text('Prostate volume — EAA cohort', 'Volume prostático — coorte EAA'), value: text('15–35 mL', '15–35 mL'), population: text('Healthy fertile men aged 23–53 years', 'Homens saudáveis e férteis de 23–53 anos'),
    method: text('Transrectal ultrasound; use the source measurement and volume conventions.', 'Ultrassonografia transretal; utilizar as convenções de medida e volume da fonte.'),
    caution: text('This selected cohort is not an age-independent normal range or a diagnostic criterion for benign prostatic hyperplasia.', 'Esta coorte selecionada não define normalidade independente da idade nem critério diagnóstico de hiperplasia prostática benigna.'), sourceIds: ['prostate'],
  },
  {
    id: 'prostate-ap', examId: 'prostate', kind: 'reference',
    name: text('Prostate AP diameter — EAA cohort', 'Diâmetro AP prostático — coorte EAA'), value: text('18–31 mm', '18–31 mm'), population: text('Healthy fertile men aged 23–53 years', 'Homens saudáveis e férteis de 23–53 anos'),
    method: text('Anteroposterior diameter on transrectal ultrasound.', 'Diâmetro anteroposterior à ultrassonografia transretal.'),
    caution: text('Interpret together with volume and age; do not transplant the range to a different acquisition or population.', 'Interpretar com volume e idade; não transferir a faixa para outra aquisição ou população.'), sourceIds: ['prostate'],
  },
  {
    id: 'thyroid-length', examId: 'thyroid', kind: 'reference',
    name: text('Thyroid lobe length', 'Comprimento do lobo tireoidiano'), value: text('4–6 cm', '4–6 cm'), population: adult,
    method: text('Maximum longitudinal length of each lobe; document three orthogonal dimensions.', 'Maior comprimento longitudinal de cada lobo; documentar três dimensões ortogonais.'),
    caution: text('Age, sex and body size affect gland size. Dimensions alone do not characterize a nodule.', 'Idade, sexo e biotipo alteram o tamanho glandular. Dimensões isoladas não caracterizam um nódulo.'), sourceIds: ['thyroid'],
  },
  {
    id: 'thyroid-ap', examId: 'thyroid', kind: 'reference',
    name: text('Thyroid lobe AP / transverse diameter', 'Diâmetro AP / transversal do lobo tireoidiano'), value: text('Approximately 1.3–2.0 cm', 'Aproximadamente 1,3–2,0 cm'), population: adult,
    method: text('Measure AP and transverse diameters separately in the transverse plane.', 'Medir separadamente os diâmetros AP e transversal no plano transversal.'),
    caution: text('Approximate source values, not universal goiter thresholds.', 'Valores aproximados da fonte, não limiares universais de bócio.'), sourceIds: ['thyroid'],
  },
  {
    id: 'thyroid-isthmus', examId: 'thyroid', kind: 'context',
    name: text('Thyroid isthmus thickness', 'Espessura do istmo tireoidiano'), value: text('Reported upper limits: 3–5 mm', 'Limites superiores descritos: 3–5 mm'), population: adult,
    method: text('Anteroposterior thickness of the isthmus in the transverse plane.', 'Espessura anteroposterior do istmo no plano transversal.'),
    caution: text('The consensus reports a range of upper limits; 3–5 mm is not a normal interval with a lower bound.', 'O consenso descreve uma faixa de limites superiores; 3–5 mm não é um intervalo normal com limite inferior.'), sourceIds: ['thyroid'],
  },
  {
    id: 'axillary-cortex', examId: 'breast', kind: 'criterion',
    name: text('Axillary lymph node cortex', 'Córtex do linfonodo axilar'), value: text('<3 mm: thin-cortex pattern', '<3 mm: padrão de córtex fino'), population: text('Adults; axillary assessment in a breast imaging context', 'Adultos; avaliação axilar no contexto mamário'),
    method: text('Measure maximal cortical thickness perpendicular to the capsule; assess hilum and symmetry.', 'Medir a maior espessura cortical perpendicular à cápsula; avaliar hilo e simetria.'),
    caution: text('Thin cortex does not exclude metastasis; thickening can be reactive. This is a morphologic criterion, not a benignity guarantee.', 'Córtex fino não exclui metástase; espessamento pode ser reacional. É um critério morfológico, não garantia de benignidade.'), sourceIds: ['axilla'],
  },
  {
    id: 'breast-skin', examId: 'breast', kind: 'context',
    name: text('Breast skin thickness', 'Espessura da pele mamária'), value: text('Measure in mm and compare symmetric sites', 'Medir em mm e comparar locais simétricos'), population: text('Adults; especially postoperative / post-radiotherapy follow-up', 'Adultos; especialmente seguimento pós-operatório / pós-radioterapia'),
    method: text('Measure epidermis and dermis perpendicular to the surface, with minimal probe pressure.', 'Medir epiderme e derme perpendicularmente à superfície, com mínima pressão do transdutor.'),
    caution: text('Site, treatment and technique change thickness; no universal 2-mm normal cutoff is applied.', 'Local, tratamento e técnica modificam a espessura; não se aplica um corte universal de normalidade de 2 mm.'), sourceIds: ['breastSkin'],
  },
  {
    id: 'endometrium', examId: 'pelvic', kind: 'context',
    name: text('Endometrium in postmenopausal bleeding', 'Endométrio no sangramento pós-menopausa'), value: text('≤4 mm does not exclude cancer', '≤4 mm não exclui câncer'), population: text('Postmenopausal patients with bleeding', 'Pacientes após a menopausa com sangramento'),
    method: text('Maximum AP endometrial echo thickness on a long-axis transvaginal view.', 'Maior espessura AP do eco endometrial em plano longitudinal transvaginal.'),
    caution: text('ACOG 2026 recommends ultrasound plus tissue sampling initially for most patients. Do not use the historical 4-mm threshold as a stand-alone discharge rule.', 'ACOG 2026 recomenda ultrassom e amostragem tecidual inicialmente para a maioria das pacientes. Não usar o limiar histórico de 4 mm como regra isolada para encerrar a investigação.'), sourceIds: ['acog2026', 'acogMethod'],
  },
  {
    id: 'ovarian-volume', examId: 'pelvic', kind: 'criterion',
    name: text('Ovarian volume and polycystic morphology', 'Volume ovariano e morfologia policística'), value: text('≥10 mL in the specified setting', '≥10 mL no contexto especificado'), population: text('Adults, not adolescents', 'Adultos, não adolescentes'),
    method: text('Three ovarian dimensions; exclude dominant follicles, corpus luteum and cysts from interpretation.', 'Três dimensões ovarianas; excluir folículos dominantes, corpo lúteo e cistos da interpretação.'),
    caution: text('A morphology criterion when technology or image quality prevents reliable whole-ovary follicle counts, or with transabdominal assessment. Not a stand-alone syndrome diagnosis.', 'Critério morfológico quando tecnologia ou qualidade impedem contagem folicular confiável de todo o ovário, ou na avaliação transabdominal. Não diagnostica a síndrome isoladamente.'), sourceIds: ['pcos'],
  },
  {
    id: 'fetal-atrium', examId: 'obstetric', kind: 'reference',
    name: text('Fetal lateral ventricular atrium', 'Átrio do ventrículo lateral fetal'), value: text('<10 mm', '<10 mm'), population: text('Fetus; routine CNS screening', 'Feto; rastreamento habitual do SNC'),
    method: text('Inner-to-inner width at the choroid plexus glomus, perpendicular to the ventricular axis.', 'Largura interna na altura do glomo do plexo coroide, perpendicular ao eixo ventricular.'),
    caution: text('Check the standard plane and calipers before interpreting borderline values; this does not replace a CNS examination.', 'Verificar plano padrão e cursores antes de interpretar medidas limítrofes; não substitui o exame do SNC.'), sourceIds: ['isuogCns'],
  },
  {
    id: 'cisterna-magna', examId: 'obstetric', kind: 'reference',
    name: text('Fetal cisterna magna', 'Cisterna magna fetal'), value: text('2–10 mm', '2–10 mm'), population: text('Fetus; mid-trimester CNS assessment', 'Feto; avaliação do SNC no segundo trimestre'),
    method: text('AP distance between the vermis and inner occipital bone in the transcerebellar plane.', 'Distância AP entre o vermis e a face interna do osso occipital no plano transcerebelar.'),
    caution: text('Plane and posterior fossa morphology matter; do not infer a diagnosis from the number alone.', 'Plano e morfologia da fossa posterior importam; não inferir diagnóstico pelo número isolado.'), sourceIds: ['isuogCns'],
  },
  {
    id: 'fetal-biometry', examId: 'obstetric', kind: 'context',
    name: text('BPD, HC, AC and femur length', 'DBP, CC, CA e comprimento do fêmur'), value: text('Gestational-age reference charts', 'Curvas por idade gestacional'), population: text('Fetus; gestational age established clinically', 'Feto; idade gestacional estabelecida clinicamente'),
    method: text('Use standardized planes and the measurement convention of the selected chart.', 'Usar planos padronizados e a convenção de medida da curva selecionada.'),
    caution: text('There is no single normal size. This module links the guideline; it does not implement growth percentiles or pregnancy dating.', 'Não existe tamanho normal único. O módulo vincula a diretriz; não calcula percentis de crescimento nem data a gestação.'), sourceIds: ['isuogBiometry'],
  },
  {
    id: 'testis-volume', examId: 'scrotal', kind: 'formula',
    name: text('Testicular volume — Lambert', 'Volume testicular — Lambert'), value: text('L × W × H × 0.71; cm → mL', 'C × L × A × 0,71; cm → mL'), population: adult,
    method: text('Three perpendicular testicular dimensions in cm, excluding the epididymis; record the formula.', 'Três dimensões testiculares perpendiculares em cm, excluindo o epidídimo; registrar a fórmula.'),
    caution: text('ESUR-SPIWG convention. Do not compare directly with volumes or cutoffs derived with the ellipsoid coefficient 0.52.', 'Convenção ESUR-SPIWG. Não comparar diretamente com volumes ou cortes derivados do coeficiente elipsoide 0,52.'), sourceIds: ['esur'],
  },
  {
    id: 'scrotal-vein', examId: 'scrotal', kind: 'criterion',
    name: text('Largest scrotal vein', 'Maior veia escrotal'), value: text('≥3 mm: varicocele size criterion', '≥3 mm: critério dimensional de varicocele'), population: adult,
    method: text('Measure the largest vein while standing during Valsalva; document the site.', 'Medir a maior veia em ortostatismo durante Valsalva; documentar o local.'),
    caution: text('A diagnostic criterion, not a normal range. Interpret with Doppler reflux and the clinical examination.', 'Critério diagnóstico, não faixa normal. Interpretar com refluxo ao Doppler e exame clínico.'), sourceIds: ['esur'],
  },
  {
    id: 'scrotal-reflux', examId: 'scrotal', kind: 'criterion',
    name: text('Scrotal venous reflux duration', 'Duração do refluxo venoso escrotal'), value: text('>2 s: abnormal reflux', '>2 s: refluxo anormal'), population: adult,
    method: text('Spectral Doppler while standing during Valsalva.', 'Doppler espectral em ortostatismo durante Valsalva.'),
    caution: text('Record maneuver and position; do not substitute color appearance for measured reflux duration.', 'Registrar manobra e posição; não substituir a duração medida pela aparência ao Doppler colorido.'), sourceIds: ['esur'],
  },
  {
    id: 'carotid-reference', examId: 'vascular', kind: 'criterion',
    name: text('Native ICA — IAC normal-pattern criteria', 'ACI nativa — critérios de padrão normal IAC'), value: text('PSV <180 cm/s; EDV <40 cm/s; ICA/CCA PSV ratio <2; no plaque', 'VPS <180 cm/s; VDF <40 cm/s; razão VPS ACI/ACC <2; sem placa'), population: text('Adults; native extracranial internal carotid artery', 'Adultos; artéria carótida interna extracraniana nativa'),
    method: text('Combine grayscale plaque assessment, color flow and angle-corrected spectral Doppler.', 'Combinar avaliação de placa em modo B, fluxo colorido e Doppler espectral com correção angular.'),
    caution: text('IAC 2023 composite criteria: low velocity alone is not normality. Plaque, near-occlusion and discordant parameters need separate assessment; not for stents.', 'Critérios compostos IAC 2023: velocidade baixa isolada não define normalidade. Placa, quase oclusão e parâmetros discordantes exigem avaliação própria; não se aplica a stents.'), sourceIds: ['iac'],
  },
  {
    id: 'aortic-diameter', examId: 'vascular', kind: 'criterion',
    name: text('Abdominal aortic diameter', 'Diâmetro da aorta abdominal'), value: text('>3.0 cm: AAA criterion in ACC/AHA §3.2.5', '>3,0 cm: critério de AAA na ACC/AHA §3.2.5'), population: adult,
    method: text('Maximum diameter, primarily outer-edge to outer-edge; avoid oblique overmeasurement.', 'Maior diâmetro, prioritariamente de borda externa a externa; evitar superestimação por obliquidade.'),
    caution: text('The same guideline starts its AAA surveillance group at 3.0 cm. Exactly 3.0 cm must not be dismissed as normal. This is not an intervention threshold.', 'A mesma diretriz inicia o grupo de vigilância de AAA em 3,0 cm. Exatamente 3,0 cm não deve ser descartado como normal. Não é limiar de intervenção.'), sourceIds: ['aorta'],
  },
  {
    id: 'median-nerve', examId: 'musculoskeletal', kind: 'mean',
    name: text('Median nerve cross-sectional area', 'Área seccional do nervo mediano'), value: text('Mean ≈8.6 mm² at the proximal carpal tunnel', 'Média ≈8,6 mm² no túnel do carpo proximal'), population: text('Healthy participants in the 2023 meta-analysis', 'Participantes saudáveis da metanálise de 2023'),
    method: text('Transverse cross-sectional area at the proximal tunnel / pisiform; state the measurement site.', 'Área seccional transversal no túnel proximal / pisiforme; informar o local da medida.'),
    caution: text('A pooled mean, not an individual normal interval or diagnostic cutoff. Sex, population and technique affect measurements.', 'Média agrupada, não intervalo individual de normalidade nem corte diagnóstico. Sexo, população e técnica alteram as medidas.'), sourceIds: ['median'],
  },
  {
    id: 'plantar-fascia', examId: 'musculoskeletal', kind: 'reference',
    name: text('Plantar fascia thickness', 'Espessura da fáscia plantar'), value: text('2–4 mm in the control group', '2–4 mm no grupo-controle'), population: text('Adult controls in the cited study', 'Controles adultos do estudo citado'),
    method: text('Longitudinal thickness just anterior to the calcaneal attachment.', 'Espessura longitudinal imediatamente anterior à inserção calcânea.'),
    caution: text('Study-specific range; a value above 4 mm can support fasciopathy but is not sufficient alone. Technique and body habitus matter.', 'Faixa do estudo; valor acima de 4 mm pode apoiar fasciopatia, mas não basta isoladamente. Técnica e biotipo importam.'), sourceIds: ['fascia'],
  },
  {
    id: 'pyloric-muscle', examId: 'pediatric', kind: 'criterion',
    name: text('Pyloric muscle thickness', 'Espessura muscular do piloro'), value: text('≥3 mm: commonly used HPS criterion', '≥3 mm: critério usual de estenose hipertrófica'), population: text('Infants with suspected hypertrophic pyloric stenosis', 'Lactentes com suspeita de estenose hipertrófica do piloro'),
    method: text('One muscle layer, excluding mucosa and lumen; avoid tangential measurement and assess relaxation dynamically.', 'Uma camada muscular, sem mucosa ou lúmen; evitar medida tangencial e avaliar dinamicamente o relaxamento.'),
    caution: text('Small or premature infants may have smaller measurements. Borderline thickness and symptoms require reassessment; no automatic exclusion below 3 mm.', 'Lactentes pequenos ou prematuros podem ter medidas menores. Espessura limítrofe e sintomas exigem reavaliação; não há exclusão automática abaixo de 3 mm.'), sourceIds: ['pylorus', 'pylorusTechnique'],
  },
  {
    id: 'pyloric-normal', examId: 'pediatric', kind: 'reference',
    name: text('Relaxed pyloric muscle', 'Musculatura pilórica relaxada'), value: text('Usually <2 mm', 'Habitualmente <2 mm'), population: text('Infants; dynamically relaxed pylorus', 'Lactentes; piloro relaxado à avaliação dinâmica'),
    method: text('Observe opening and passage of gastric contents in addition to muscle thickness.', 'Observar abertura e passagem de conteúdo gástrico, além da espessura muscular.'),
    caution: text('Contraction or tangential imaging can simulate thickening. Persistent 2–3 mm thickness without relaxation is not a reassuring normal result.', 'Contração ou imagem tangencial podem simular espessamento. Espessura persistente de 2–3 mm sem relaxamento não é resultado normal tranquilizador.'), sourceIds: ['pylorusTechnique'],
  },
  {
    id: 'pediatric-renal-length', examId: 'pediatric', kind: 'context',
    name: text('Pediatric renal length', 'Comprimento renal pediátrico'), value: text('Height-based percentiles', 'Percentis por estatura'), population: text('Children and adolescents, 0–19 years in the reference cohort', 'Crianças e adolescentes, 0–19 anos na coorte de referência'),
    method: text('Maximum bipolar length; compare with a height-appropriate reference chart.', 'Maior comprimento bipolar; comparar com curva de referência apropriada à estatura.'),
    caution: text('The linked Central European cohort is not a Brazilian validation. No adult 10–12 cm cutoff or calculated percentile is applied by this module.', 'A coorte centro-europeia vinculada não é validação brasileira. O módulo não aplica o corte adulto de 10–12 cm nem calcula percentis.'), sourceIds: ['pediatricKidney'],
  },
];

export const examKey = (id: UltrasoundExamId, field: 'title' | 'description') => `ultrasound.exam.${id}.${field}`;
export const measurementKey = (id: string, field: MeasurementField) => `ultrasound.measurement.${id}.${field}`;
export const examRoute = (id: UltrasoundExamId) => `/ultrasound/${id}`;
export function ultrasoundExamById(id: UltrasoundExamId) {
  const exam = ultrasoundExams.find((item) => item.id === id);
  if (!exam) throw new Error(`Unknown ultrasound exam: ${id}`);
  return exam;
}
export function ultrasoundSourceById(id: UltrasoundSourceId) {
  const source = ultrasoundSources.find((item) => item.id === id);
  if (!source) throw new Error(`Unknown ultrasound source: ${id}`);
  return source;
}
export function normalizeUltrasoundSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
}
/** Every search word must match; accents and case do not affect discovery. */
export function searchUltrasoundMeasurements(query: string, language: UltrasoundLanguage, examId?: UltrasoundExamId): readonly UltrasoundMeasurement[] {
  const terms = normalizeUltrasoundSearch(query).split(' ').filter(Boolean);
  return ultrasoundMeasurements.filter((item) => {
    if (examId !== undefined && item.examId !== examId) return false;
    const exam = ultrasoundExamById(item.examId);
    const haystack = normalizeUltrasoundSearch([
      exam.title[language], exam.description[language], item.name[language], item.value[language],
      item.population[language], item.method[language], item.caution[language],
      ...item.sourceIds.map((id) => ultrasoundSourceById(id).title),
    ].join(' '));
    return terms.every((term) => haystack.includes(term));
  });
}
