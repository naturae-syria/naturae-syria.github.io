import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutSection() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-orange-700">عن ناتورا وأفون</CardTitle>
          <CardDescription className="text-lg text-gray-700">
            قوتان رائدتان في مجال مستحضرات التجميل والعناية الشخصية
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            تبرز شركتا <strong>ناتورا</strong> و<strong>أفون</strong> كقوتين رائدتين في مجال مستحضرات التجميل والعناية
            الشخصية، حيث تنبع جذورهما من البرازيل وتنتشر فروع تأثيرهما في الأسواق العالمية. ويجمع بينهما التزام عميق
            بتقديم منتجات عالية الجودة، مصممة لتلبي الاحتياجات المتنوعة للمستهلكين، مع مراعاة الاستدامة البيئية
            والاجتماعية، واستلهام الابتكار من ثراء التنوع البيولوجي البرازيلي.
          </p>

          <p>
            نحن في <strong>شركة المؤيد</strong> نفتخر بكوننا موزعين رسميين لمنتجات ناتورا وأفون في البرازيل، حيث نعمل
            على استيراد هذه المنتجات الأصلية مباشرة من قلب البرازيل لتصل إلى السوق السورية، حاملة معها خلاصة الجمال
            البرازيلي النقي.
          </p>

          <Tabs defaultValue="natura" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="natura">ناتورا</TabsTrigger>
              <TabsTrigger value="avon">أفون</TabsTrigger>
            </TabsList>

            <TabsContent value="natura" className="space-y-4 mt-4">
              <h3 className="text-xl font-bold text-orange-700">ناتورا: عندما تلتقي الطبيعة بالعلم</h3>
              <p>
                تعتمد ناتورا في فلسفتها على مبدأ الاستدامة، حيث يتم اختيار مكوناتها الطبيعية من مصادر مسؤولة، ولا سيما
                من غابات الأمازون الغنية. وتنعكس هذه الفلسفة في مجموعاتها الرئيسية:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">تودوديا (Tododia)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    مجموعة مثالية للعناية اليومية بالجسم، بتركيبات طبيعية وروائح منعشة، تركز على ترطيب البشرة وتعزيز
                    نعومتها.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">كرونوس (Chronos)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    حلول متقدمة لمكافحة علامات التقدم في العمر، باستخدام مكونات نباتية فعالة وتقنيات مبتكرة.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">إيكوس (Ekos)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    تجسد التزام ناتورا بالاستدامة من خلال استخدام مكونات أمازونية نادرة يتم جمعها بشكل أخلاقي وبطريقة
                    تحافظ على البيئة والمجتمعات المحلية.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">لومينا (Lumina)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    تركيبات متطورة للعناية بالشعر، تعتمد على علوم حيوية ومكونات نباتية لإصلاح الشعر وتعزيز صحته.
                  </CardContent>
                </Card>
              </div>

              <h4 className="font-bold text-orange-700 mt-4">شهادات ناتورا الموثوقة في الاستدامة:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>B Corporation:</strong> شهادة مرموقة تعكس أعلى معايير الأداء الاجتماعي والبيئي.
                </li>
                <li>
                  <strong>UEBT:</strong> تؤكد على جمع المكونات من مصادر مسؤولة وأخلاقية.
                </li>
                <li>
                  <strong>Leaping Bunny:</strong> تضمن خلو المنتجات من أي اختبارات على الحيوانات.
                </li>
                <li>
                  <strong>RSPO:</strong> عضوية في مائدة زيت النخيل المستدام.
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="avon" className="space-y-4 mt-4">
              <h3 className="text-xl font-bold text-orange-700">أفون: التمكين والجمال في متناول الجميع</h3>
              <p>
                تُعرف أفون بتاريخ عريق في توفير منتجات تجميل وعناية شخصية عالية الجودة بأسعار مناسبة، مع تركيزها على
                تمكين المرأة ودعم خياراتها. وتقدم من خلال مجموعاتها تنوعًا واسعًا يشمل:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">أفون كير (Avon Care)</CardTitle>
                  </CardHeader>
                  <CardContent>مستحضرات أساسية للعناية اليومية بالبشرة والجسم، بتركيبات لطيفة وفعالة.</CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">زيوت أفون (Avon Óleo)</CardTitle>
                  </CardHeader>
                  <CardContent>زيوت طبيعية للعناية العميقة بالبشرة والشعر، تمنح ترطيبًا مكثفًا ولمعانًا صحيًا.</CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">مجموعة العناية بالشعر</CardTitle>
                  </CardHeader>
                  <CardContent>حلول متنوعة تناسب جميع أنواع الشعر وتلبي احتياجاته المتعددة.</CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">مجموعة (Renew)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    مجموعة متخصصة في العناية بالبشرة ومكافحة علامات التقدم في السن, تركز على تقديم حلول مبتكرة وفعالة
                    لمساعدة البشرة على استعادة شبابها وإشراقتها.
                  </CardContent>
                </Card>
              </div>

              <h4 className="font-bold text-orange-700 mt-4">شهادات أفون الموثوقة:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Leaping Bunny:</strong> تؤكد خلو المنتجات من أي اختبار على الحيوانات.
                </li>
                <li>
                  <strong>FSC:</strong> لضمان استخدام عبوات مصنوعة من مصادر غابية مسؤولة.
                </li>
              </ul>
            </TabsContent>
          </Tabs>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mt-6">
            <h3 className="text-xl font-bold text-orange-700 mb-2">كلمة أخيرة:</h3>
            <p>
              تجسد ناتورا وأفون مستقبل الجمال القائم على <strong>الابتكار، الأخلاق، والاستدامة</strong>. ونحن في{" "}
              <strong>شركة المؤيد</strong> نعتز بأن نكون الجسر الذي يصل هذا الجمال البرازيلي إلى كل بيت سوري، عبر منتجات
              موثوقة، طبيعية، وفعّالة، لتجربة تجميل آمنة وفريدة من نوعها.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
