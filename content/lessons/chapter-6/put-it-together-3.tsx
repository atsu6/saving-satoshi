'use client'
import { ScriptingChallenge, Table, Text, LessonInfo, CodeExample } from 'ui'
import { useEffect, useState } from 'react'
import { useTranslations } from 'hooks'
import { EditorConfig } from 'types'
import { getLessonKey } from 'lib/progress'
import { getData } from 'api/data'

export const metadata = {
  title: 'chapter_six.put_it_together_one.title',
  key: 'CH6PUT3',
}

export default function PutItTogether3({ lang }) {
  const t = useTranslations(lang)

  const [prevData, setPrevData] = useState<any>({ lesson: '', data: '' })
  const [isLoading, setIsLoading] = useState(true)

  const getPrevLessonData = async () => {
    const data = await getData('CH6PUT2')
    if (data) {
      setPrevData({
        lesson_id: 'CH6PUT2',
        data: data?.code?.getDecoded(),
      })
    }
  }

  useEffect(() => {
    getPrevLessonData().finally(() => setIsLoading(false))
  }, [])

  const handleSelectLanguage = (language: string) => {
    setLanguage(language)
  }

  function countLines(text: string): number {
    return text.split(/\r\n|\r|\n/).length
  }

  const javascript = {
    program: `//BEGIN VALIDATION BLOCK
const assert = require('assert');
const bech32 = require('@savingsatoshi/bech32js');
class Outpoint {
  constructor(txid, index) {
    assert(Buffer.isBuffer(txid));
    assert(txid.length === 32);
    assert(Number.isInteger(index));
    this.txid = txid;
    this.index = index;
  }

  serialize() {
    const buf = Buffer.alloc(36);
    this.txid.copy(buf, 0);
    buf.writeUInt32LE(this.index, 32);
    return buf;
  }
}

class Input {
  constructor() {
    this.outpoint = null;
    this.script = Buffer.alloc(0);
    this.sequence = 0xffffffff;
    this.value = 0;
    this.scriptcode = Buffer.alloc(0);
  }

  static from_output(txid, vout, value, scriptcode) {
    const self = new this();
    self.outpoint = new Outpoint(Buffer.from(txid.replace('0x', ''),  'hex').reverse(), vout);
    self.value = value;
    self.scriptcode = Buffer.from(scriptcode.replace('0x', ''), 'hex');
    return self;
  }

  serialize() {
    const buf = Buffer.alloc(32 + 4 + 1 + 4);
    this.outpoint.serialize().copy(buf, 0);
    buf.writeUInt8(this.script.length, 36);
    // Optional, since we know in SegWit it's always zero bytes.
    // Adding this back will offset all following byte length positions.
    // this.script.copy(buf, 37);
    buf.writeUInt32LE(this.sequence, 37);
    return buf;
  }
}

class Output {
  constructor() {
    this.value = 0;
    this.witness_version = 0;
    this.witness_data = Buffer.alloc(0);
  }

  static from_options(addr, value) {
    assert(Number.isInteger(value));
    const self = new this();
    const {version, program} = bech32.decode('bc', addr);
    self.witness_version = version;
    self.witness_data = Buffer.from(program);
    self.value = value;
    return self;
  }

  serialize() {
    const buf = Buffer.alloc(11);
    buf.writeBigInt64LE(BigInt(this.value), 0);
    buf.writeUInt8(this.witness_data.length + 2, 8);
    buf.writeUInt8(this.witness_version, 9);
    buf.writeUInt8(this.witness_data.length, 10);
    return Buffer.concat([buf, this.witness_data]);
  }
}

class Witness {
  constructor() {
    this.items = [];
  }

  push_item(data) {
    this.items.push(data);
  }

  serialize() {
    let buf = Buffer.from([this.items.length]);
    for (const item of this.items)
      buf = Buffer.concat([buf, Buffer.from([item.length]), item]);
    return buf;
  }
}

const txid = '8a081631c920636ed71f9de5ca24cb9da316c2653f4dc87c9a1616451c53748e';
const vout = 1;
const valueOne = 650000000;
const scriptcode = '1976a914b234aee5ee74d7615c075b4fe81fd8ace54137f288ac';
const input = Input.from_output(txid, vout, valueOne, scriptcode);
const addr = 'bc1qgghq08syehkym52ueu9nl5x8gth23vr8hurv9dyfcmhaqk4lrlgs28epwj';
const valueTwo = 100000000;
const output = Output.from_options(addr, valueTwo);
const witness = new Witness();
witness.push_item(Buffer.from('304402202e343143d5fcb0e3ece2ef11983d69dcaeb7407efe2ec7e3c830ab66927823c0022000ac4c1b3bcc857684e6bc2a36c07757695ef72b7bac70d2c877895798c4d1ba01', 'hex'));
witness.push_item(Buffer.from('038cd0455a2719bf72dc1414ef8f1675cd09dfd24442cb32ae6e8c8bbf18aaf5af', 'hex'));
const tx = new Transaction();
tx.inputs.push(input);
tx.outputs.push(output);
console.log(tx.digest(0).toString('hex') === 'a25cca939c60a6437de9872e51145be8afdaa7255d5395f11c33394a69d8d13a' && 'true')
console.log('KILL')
`,
    defaultFunction: {
      name: 'put-it-together-2',
      args: ['args'],
    },
    defaultCode: `const {Hash} = require('crypto');

${prevData.data.slice(0, -2)}
  digest(input_index) {
    const sighash = 1;
    // YOUR CODE HERE
  }
}`,
    validate: async (answer: string) => {
      if (answer) {
        if (answer === 'true') {
          return [true, 'Nicely done']
        }
        return [false, 'Not a valid hex value']
      }
      return [false, 'Please return a value']
    },
    constraints: [
      {
        range: [
          countLines(prevData.data.slice(0, -2)) + 5,
          1,
          countLines(prevData.data.slice(0, -2)) + 6,
          1,
        ],
        allowMultiline: true,
      },
    ],
  }

  const python = {
    program: `# BEGIN VALIDATION BLOCK
from struct import pack
from bech32py import bech32
class Outpoint:
    def __init__(self, txid, index):
        assert isinstance(txid, bytes)
        assert len(txid) == 32
        assert isinstance(index, int)
        self.txid = txid
        self.index = index

    def serialize(self):
        r = b""
        r += self.txid
        r += pack("<I", self.index)
        return r

class Input:
    def __init__(self):
        self.outpoint = None
        self.script = b""
        self.sequence = 0xffffffff
        self.value = 0
        self.scriptcode = b""

    @classmethod
    def from_output(cls, txid, vout, value, scriptcode):
        self = cls()
        self.outpoint = Outpoint(bytes.fromhex(txid)[::-1], vout)
        self.value = value
        self.scriptcode = bytes.fromhex(scriptcode)
        return self

    def serialize(self):
        r = b""
        r += self.outpoint.serialize()
        r += pack("<B", len(self.script))
        # Optional, since we know in SegWit it's always zero bytes
        # r += self.script
        r += pack("<I", self.sequence)
        return r

class Output:
    def __init__(self):
        self.value = 0
        self.witness_version = 0
        self.witness_data = b""

    @classmethod
    def from_options(cls, addr, value):
        assert isinstance(value, int)
        self = cls()
        (ver, data) = bech32.decode("bc", addr)
        self.witness_version = ver
        self.witness_data = bytes(data)
        self.value = value
        return self

    def serialize(self):
        r = b""
        r += pack("<q", self.value)
        r += pack("<B", len(self.witness_data) + 2)
        r += pack("<B", self.witness_version)
        r += pack("<B", len(self.witness_data))
        r += self.witness_data
        return r

class Witness:
    def __init__(self):
        self.items = []

    def push_item(self, data):
        self.items.append(data)

    def serialize(self):
        r = b""
        r += pack("<B", len(self.items))
        for item in self.items:
            r += pack("<B", len(item))
            r += item
        return r

txid = "8a081631c920636ed71f9de5ca24cb9da316c2653f4dc87c9a1616451c53748e"
vout = 1
value = 650000000
scriptcode = "1976a914b234aee5ee74d7615c075b4fe81fd8ace54137f288ac"
input = Input.from_output(txid, vout, value, scriptcode)
addr = "bc1qgghq08syehkym52ueu9nl5x8gth23vr8hurv9dyfcmhaqk4lrlgs28epwj"
value = 100000000
output = Output.from_options(addr, value)
witness = Witness()
witness.push_item(bytes.fromhex("304402202e343143d5fcb0e3ece2ef11983d69dcaeb7407efe2ec7e3c830ab66927823c0022000ac4c1b3bcc857684e6bc2a36c07757695ef72b7bac70d2c877895798c4d1ba01"))
witness.push_item(bytes.fromhex("038cd0455a2719bf72dc1414ef8f1675cd09dfd24442cb32ae6e8c8bbf18aaf5af"))
tx = Transaction()
tx.inputs.append(input)
tx.outputs.append(output)
print(tx.digest(0).hex() == 'a25cca939c60a6437de9872e51145be8afdaa7255d5395f11c33394a69d8d13a' and 'true')
print("KILL")`,
    defaultFunction: {
      name: 'put-it-together-2',
      args: ['args'],
    },
    defaultCode: `import hashlib
${prevData.data}
    def digest(self, input_index: int):
        sighash = 1
        # YOUR CODE HERE
`,
    validate: async (answer: string) => {
      if (answer) {
        if (answer === 'true') {
          return [true, 'Nicely Done ']
        }
        return [false, 'Not a valid hex value']
      }
      return [false, 'Return a value']
    },
    constraints: [
      {
        range: [
          countLines(prevData.data.slice(0, -2)) + 5,
          1,
          countLines(prevData.data.slice(0, -2)) + 6,
          1,
        ],
        allowMultiline: true,
      },
    ],
  }

  const config: EditorConfig = {
    defaultLanguage: 'javascript',
    languages: {
      javascript,
      python,
    },
  }

  const [language, setLanguage] = useState(config.defaultLanguage)

  return (
    !isLoading && (
      <ScriptingChallenge
        lang={lang}
        config={config}
        saveData
        lessonKey={getLessonKey('chapter-6', 'put-it-together-3')}
        successMessage={t('chapter_six.put_it_together_three.success')}
        onSelectLanguage={handleSelectLanguage}
      >
        <LessonInfo className="overflow-y-scroll  sm:max-h-[calc(100vh-70px)]">
          <Text className="font-nunito text-2xl font-bold text-white">
            {t('chapter_six.put_it_together_three.heading')}
          </Text>
          <Text className="mt-2 font-nunito text-xl text-white">
            {t('chapter_six.put_it_together_three.paragraph_one')}
          </Text>
          <Text className="mt-4 text-lg md:text-xl">
            {t('chapter_six.put_it_together_three.paragraph_two')}
          </Text>
          <Text className="mt-4 text-lg md:text-xl">
            {t('chapter_six.put_it_together_three.list_heading')}
          </Text>
          <ul className="list-disc pl-5 font-nunito">
            <li className="text-lg md:text-xl">
              {t('chapter_six.put_it_together_three.list_one')}
            </li>
            <li className="text-lg md:text-xl">
              {t('chapter_six.put_it_together_three.list_two')}
            </li>
            <li className="text-lg md:text-xl">
              {t('chapter_six.put_it_together_three.list_three')}
            </li>
          </ul>
          <Text className="mt-4 text-lg md:text-xl">
            {t('chapter_six.put_it_together_three.paragraph_three')}
          </Text>
          <CodeExample
            className="mt-4 font-space-mono"
            code={`0x1976a914{20-byte-pubkey-hash}88ac`}
            language="shell"
          />
          <Text className="mt-4 text-lg md:text-xl">
            {t('chapter_six.put_it_together_three.paragraph_four')}
          </Text>
          <CodeExample
            className="mt-4 font-space-mono"
            code={`OP_PUSHBYTES_25
OP_DUP
OP_HASH160
OP_PUSHBYTES_20
<20-byte-public-key-hash>
OP_EQUALVERIFY
OP_CHECKSIG`}
            language="shell"
          />
          <Text className="mt-4 text-lg md:text-xl">
            {t('chapter_six.put_it_together_three.paragraph_five')}
          </Text>
          <Text className="mt-4 text-lg md:text-xl">
            {t('chapter_six.put_it_together_three.paragraph_six')}
          </Text>
          <Table
            headings={[
              t('chapter_six.put_it_together_three.headings.item_one'),
              t('chapter_six.put_it_together_three.headings.item_two'),
              t('chapter_six.put_it_together_three.headings.item_three'),
              t('chapter_six.put_it_together_three.headings.item_four'),
            ]}
            rows={[
              [
                t('chapter_six.put_it_together_three.table.row_one.item_one'),
                t('chapter_six.put_it_together_three.table.row_one.item_two'),
                t('chapter_six.put_it_together_three.table.row_one.item_three'),
                t('chapter_six.put_it_together_three.table.row_one.item_four'),
              ],
              [
                t('chapter_six.put_it_together_three.table.row_two.item_one'),
                t('chapter_six.put_it_together_three.table.row_two.item_two'),
                t('chapter_six.put_it_together_three.table.row_two.item_three'),
                t('chapter_six.put_it_together_three.table.row_two.item_four'),
              ],
              [
                t('chapter_six.put_it_together_three.table.row_three.item_one'),
                t('chapter_six.put_it_together_three.table.row_three.item_two'),
                t(
                  'chapter_six.put_it_together_three.table.row_three.item_three'
                ),
                t(
                  'chapter_six.put_it_together_three.table.row_three.item_four'
                ),
              ],
              [
                t('chapter_six.put_it_together_three.table.row_four.item_one'),
                t('chapter_six.put_it_together_three.table.row_four.item_two'),
                t(
                  'chapter_six.put_it_together_three.table.row_four.item_three'
                ),
                t('chapter_six.put_it_together_three.table.row_four.item_four'),
              ],
              [
                t('chapter_six.put_it_together_three.table.row_five.item_one'),
                t('chapter_six.put_it_together_three.table.row_five.item_two'),
                t(
                  'chapter_six.put_it_together_three.table.row_five.item_three'
                ),
                t('chapter_six.put_it_together_three.table.row_five.item_four'),
              ],
              [
                t('chapter_six.put_it_together_three.table.row_six.item_one'),
                t('chapter_six.put_it_together_three.table.row_six.item_two'),
                t('chapter_six.put_it_together_three.table.row_six.item_three'),
                t('chapter_six.put_it_together_three.table.row_six.item_four'),
              ],
              [
                t('chapter_six.put_it_together_three.table.row_seven.item_one'),
                t('chapter_six.put_it_together_three.table.row_seven.item_two'),
                t(
                  'chapter_six.put_it_together_three.table.row_seven.item_three'
                ),
                t(
                  'chapter_six.put_it_together_three.table.row_seven.item_four'
                ),
              ],
              [
                t('chapter_six.put_it_together_three.table.row_eight.item_one'),
                t('chapter_six.put_it_together_three.table.row_eight.item_two'),
                t(
                  'chapter_six.put_it_together_three.table.row_eight.item_three'
                ),
                t(
                  'chapter_six.put_it_together_three.table.row_eight.item_four'
                ),
              ],
              [
                t('chapter_six.put_it_together_three.table.row_nine.item_one'),
                t('chapter_six.put_it_together_three.table.row_nine.item_two'),
                t(
                  'chapter_six.put_it_together_three.table.row_nine.item_three'
                ),
                t('chapter_six.put_it_together_three.table.row_nine.item_four'),
              ],
              [
                t('chapter_six.put_it_together_three.table.row_ten.item_one'),
                t('chapter_six.put_it_together_three.table.row_ten.item_two'),
                t('chapter_six.put_it_together_three.table.row_ten.item_three'),
                t('chapter_six.put_it_together_three.table.row_ten.item_four'),
              ],
            ]}
          />

          <Text className="mt-2 font-nunito text-xl text-white">
            {t('chapter_six.put_it_together_three.paragraph_seven')}
          </Text>
        </LessonInfo>
      </ScriptingChallenge>
    )
  )
}
